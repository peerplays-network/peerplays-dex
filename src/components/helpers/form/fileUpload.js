import counterpart from 'counterpart';
import React, {Component} from 'react';

class FileUpload extends Component{

    state = {
        fileName: ''
    };

    handleFile = (e) => {
        const file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = loaded => {
            const content = new Buffer(loaded.target.result, "binary");
            const fileName = file.name;
            const lastModified = new Date(file.lastModified).toString();
            this.setState({fileName}, () => {
                this.props.onChange({ content, fileName, lastModified }, this.props.id)
            })
        };
        reader.readAsBinaryString(file);
    };

    render(){

        const {id, fileSizes} = this.props;
        const fileName = this.state.fileName;

        return(
            <label htmlFor={id} className="upload">
                <div className="upload__info">
                    <span className="upload__text" fileSize={fileSizes}>{counterpart.translate(`field.labels.${id}`)}</span>
                    <span className="upload__file-name">{fileName}</span>
                </div>
                <span className="upload__btn btn-round">{counterpart.translate(`buttons.${fileName ? 'useAnother' : 'upload'}`)}</span>
                <input id={id} className="upload__input" type="file" onChange={this.handleFile} accept={fileSizes}/>
            </label>
        )
    }
}

export default FileUpload;