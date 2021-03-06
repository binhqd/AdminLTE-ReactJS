import React from 'react';
import {PropTypes} from 'prop-types';
import Promise from 'bluebird';
import {connect} from 'react-redux';
import {CategoryParentList} from 'components/category';
import {Categories} from 'api';
import CONFIG from 'base/constants/config';

class CategoryForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      name: '',
      description: '',
      parent_id: null,
      logo: null
    }
  }

  onInputChange(name, e) {
    this.setState({
      [name]: e.target.value
    })
  }

  submitForm(e) {

    let params = {};

    let data = {
      name: this.state.name,
      description: this.state.description,
      parent_id: this.state.parent_id,
      logo: this.state.logo
    }

    if (typeof this.props.categoryId != "undefined") {
      params = {id: this.props.categoryId};

      // prevent self parenting
      if (this.props.categoryId == data.parent_id) {
        delete data.parent_id;
      }
    }

    return this.props.dispatch(this.props.fnSubmit(params, {
      data
    }))
      .then(response => {
        // reload list
        this.props.dispatch(Categories.actions.list());

        if (typeof this.props.cb == 'function') {
          this.props.cb(response);
        }

        return Promise.resolve(response)
      })
      .catch(err => {
        Promise.reject(err);
      })
  }

  componentDidMount() {
    if (this.props.categoriesAsTree.length == 0) {
      this.props.dispatch(Categories.actions.list());
    }

    if (this.props.categoryHash && this.props.categoryHash[this.props.categoryId]) {
      let category = this.props.categoryHash[this.props.categoryId];
      this.setState({...category});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categoryHash && nextProps.categoryHash[this.props.categoryId]) {
      let category = nextProps.categoryHash[this.props.categoryId];

      this.setState({...category});
    }
  }

  handleFileUpload(e) {
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      // file load end
      let data = new FormData();
      data.append('fileUpload', file);

      this.props.dispatch(
        Categories.actions.uploadLogo({}, {
          data: data
        })
      ).then(response => {
        this.setState({
          logo: response.data.name
        })
      }).catch(err => {
        console.log(err);
      });
    };
    reader.readAsDataURL(file);
  }

  selectParent(id) {
    this.setState({
      parent_id: id
    });
  }

  removeLogo() {
    this.setState({
      logo: ''
    })
  }

  render() {
    let parentCategory = this.props.categoryHash[this.state.parent_id];
    return (
      <div>
        <div className="form-group">
          <label htmlFor="formCatName">Name</label>
          <input type="text" className="form-control" value={this.state.name} placeholder="Name" onChange={this.onInputChange.bind(this, 'name')}/>
        </div>
        <div className="form-group">
          <label htmlFor="formCatDescription">Description</label>
          <textarea className="form-control" placeholder="Description" onChange={this.onInputChange.bind(this, 'description')}
            value={this.state.description}
            />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Select category:</label>
          <CategoryParentList parentCategory={this.state.parent_id} onChange={this.selectParent.bind(this)}/>
        </div>
        <div className="form-group">
          {
            (() => {
              let img = require('assets/images/placeholder-128.jpg');

              if (this.state.logo) {
                img = `${CONFIG.staticURL}/category-logos/${this.state.logo}`;
              }

              return (
                <div>
                  <img className="media-object" src={img} alt="..." width="64" height="64"/> [ <a href='javascript:void(0)' onClick={this.removeLogo.bind(this)}>Remove</a> ]
                </div>
              )
            })()
          }
          <label htmlFor="exampleInputFile">Category logo</label>
          <input ref='uploadFile' type="file" className="form-control-file" aria-describedby="fileHelp" onChange={this.handleFileUpload.bind(this)}/>

        </div>

        <button type="submit" className="btn btn-primary" onClick={this.submitForm.bind(this)}>{
            typeof this.props.categoryId == "undefined" ?
            'Add new'
            : 'Update'
          }</button>

        <button type='button' className="btn" onClick={() => this.props.history.push('/categories')}>Cancel</button>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    categoriesAsTree: state.categoriesAsTree,
    categoryHash: state.categoryHash
  }
}

CategoryForm.propTypes = {
  fnSubmit: PropTypes.func.isRequired
}

CategoryForm.contextTypes = {
  router: React.PropTypes.object
};

export default connect(mapStateToProps)(CategoryForm);
