import React, { Component } from "react";

import uuid from "uuid/v4";
import { firebase, imageStorageRef } from "../../firebase";

import { Upload, Icon, Modal } from "antd";

import styled from "styled-components";

class UpdatePostImages extends Component {
  state = {
    images: [],
    fileList: [],
    previewImage: "",
    previewVisible: false
  };

  imageUploadHandler = image => {
    return imageStorageRef.child(uuid()).put(image);
  };

  onUploadStateChange = data => snapshot => {
    const { bytesTransferred, totalBytes } = snapshot;
    let progress = bytesTransferred / totalBytes * 100;
    data.onProgress({ percent: progress });
  };

  onUploadError = data => error => {
    console.error(error);
    data.onError();
  };

  onUploadSuccess = (data, file, uploadTask) => () => {
    const { downloadURL } = uploadTask.snapshot;
    const { pushImages } = this.props;
    data.onSuccess(null, file);

    pushImages(downloadURL);
  };

  handleExistingFileRemove = imageUrl => async () => {
    console.log(imageUrl);
    firebase
      .storage()
      .refFromURL(imageUrl)
      .delete()
      .then(() => {
        this.props.removeImage(imageUrl);

        const filteredImages = this.state.images.filter(image => {
          return image !== imageUrl;
        });

        this.setState(state => ({
          images: filteredImages
        }));
      })
      .catch(error => console.error(error));
  };

  handleFileRemove = async image => {
    const { name } = image;

    let imageURL = "";
    await imageStorageRef
      .child(name)
      .getDownloadURL()
      .then(url => {
        imageURL = url;
      })
      .catch(error => console.error(error));

    imageStorageRef
      .child(name)
      .delete()
      .then(() => {
        const { removeImage } = this.props;
        removeImage(imageURL);
      })
      .catch(error => console.error(error));
  };

  handleModalCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => () => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  handleFileUpload = data => {
    const { file } = data;
    const uploadTask = this.imageUploadHandler(file);
    uploadTask.on(
      "state_changed",
      this.onUploadStateChange(data),
      this.onUploadError(data),
      this.onUploadSuccess(data, file, uploadTask)
    );
  };

  componentWillReceiveProps(nextProps) {
    const { images } = nextProps;

    if (!this.props.images) {
      return this.setState(state => ({
        images
      }));
    }

    return;
  }

  render() {
    const { previewVisible, previewImage, fileList, images = [] } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <ImagesRow>
          {images &&
            images.map(image => (
              <ImageTile key={image}>
                <img style={{ width: "100%" }} src={image} alt={image} />
                <ImageOverlay>
                  <StyledIcon
                    type="eye-o"
                    title={"Preview file"}
                    onClick={this.handlePreview({ url: image })}
                  />
                  <StyledIcon
                    type="delete"
                    title={"Remove file"}
                    onClick={this.handleExistingFileRemove(image)}
                  />
                </ImageOverlay>
              </ImageTile>
            ))}
        </ImagesRow>
        <Upload
          action=""
          multiple={true}
          customRequest={this.handleFileUpload}
          listType="picture-card"
          fileList={fileList}
          showUploadList={true}
          onPreview={this.handlePreview}
          onRemove={this.handleFileRemove}
          onChange={this.handleChange}
        >
          {fileList.length + images.length >= 7 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleModalCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

const Row = styled.div`
  display: flex;
`;

const ImagesRow = Row.extend`
  flex-wrap: wrap;
`;

const ImageTile = styled.div`
  margin: 4px;
  padding: 8px;
  width: 102px;
  height: 102px;
  border-radius: 5px;
  border: 1px solid lightgrey;
  transition: all 0.2s linear;
`;

const ImageOverlay = Row.extend`
  z-index: 1;
  opacity: 0;
  bottom: 63px;
  height: 100%;
  position: relative;
  align-items: center;
  justify-content: center;
  transition: all 0.2s linear;
  &:hover {
    opacity: 100;
    background-color: rgba(0, 0, 0, 0.65);
  }
`;

const StyledIcon = styled(Icon)`
  color: white;
  margin: 0px 4px;
  font-size: 16px;
  cursor: pointer;
`;

export default UpdatePostImages;
