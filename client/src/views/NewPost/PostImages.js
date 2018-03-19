import React, { Component } from "react";
import { imageStorageRef } from "../../firebase";

import { Upload, Icon, Modal } from "antd";

class PostImages extends Component {
  state = {
    images: [],
    fileList: [],
    previewImage: "",
    previewVisible: false
  };

  imageUploadHandler = image => {
    const { name } = image;
    return imageStorageRef.child(name).put(image);
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
    console.log("SUCCESS!");
    data.onSuccess(null, file);

    pushImages(downloadURL);
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

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  handleFileUpload = data => {
    console.log("HANDLE FILE UPLOAD");
    const { file } = data;
    const uploadTask = this.imageUploadHandler(file);
    uploadTask.on(
      "state_changed",
      this.onUploadStateChange(data),
      this.onUploadError(data),
      this.onUploadSuccess(data, file, uploadTask)
    );
  };

  render() {
    const { previewVisible, previewImage, fileList, images } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action=""
          multiple={true}
          customRequest={this.handleFileUpload}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onRemove={this.handleFileRemove}
          onChange={this.handleChange}
        >
          {fileList.length >= 6 ? null : uploadButton}
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

export default PostImages;
