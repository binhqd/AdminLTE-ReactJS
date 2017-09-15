'use strict';
import React from 'react';
import {Link} from 'react-router-dom';
import {MultiLevelMenu} from 'components/UI/Menu';

class ASide extends React.Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    return (
      <aside className="main-sidebar">
        <section className="sidebar">
          <div className="user-panel">
            <div className="pull-left image">
              <img src={require("assets/images/user2-160x160.jpg")} className="img-circle" alt="User Image"/>
            </div>
            <div className="pull-left info">
              <p>Alexander Pierce</p>
              <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
            </div>
          </div>
          <form action="#" method="get" className="sidebar-form">
            <div className="input-group">
              <input type="text" name="q" className="form-control" placeholder="Search..."/>
                  <span className="input-group-btn">
                    <button type="submit" name="search" id="search-btn" className="btn btn-flat"><i className="fa fa-search"></i>
                    </button>
                  </span>
            </div>
          </form>
          <ul className="sidebar-menu">
            <li className="header">MAIN NAVIGATION</li>
            <li className="active treeview">
              <a href="#">
                <i className="fa fa-dashboard"></i> <span>Dashboard</span>
                <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul className="treeview-menu">
                <li className="active"><Link to="/categories"><i className="fa fa-circle-o"></i>Categories Manager</Link></li>
                <li><Link to="/businesses"><i className="fa fa-circle-o"></i>Businesses Manager</Link></li>
              </ul>
            </li>
            <MultiLevelMenu/>
          </ul>
        </section>
      </aside>
    );
  }
}

export default ASide;
