import React, { Component } from "react";
import PropTypes from "prop-types";
import { Menu } from "antd";
import Link from "next/link";

import MenuStyles from "./left-menu.module.css";
import {
  ES7Feature,
  ES8Feature,
  ES9Feature,
  ES10Feature,
  ES11Feature,
} from "../utils/feature-dic";

const { SubMenu } = Menu;

export default class LeftMenu extends Component {
  static propTypes = {
    defaultOpenKeys: PropTypes.array,
  }

  onMenuClick = (key) => {
    // console.log(key);
  }

  render() {
    // console.log(`defaultOpenKeys is ${JSON.stringify(this.props.defaultOpenKeys)}`);

    return (
      <Menu
        className={MenuStyles.left_menu}
        mode="inline"
        onClick={this.onMenuClick}
        defaultOpenKeys={this.props.defaultOpenKeys}
      >
        <SubMenu title="ES 7" key="es7">
          {
            Object.values(ES7Feature).map(item => 
              <Menu.Item key={item.key}>
                <Link href={`/es7/${item.key}`}>
                  <a>{item.name}</a>
                </Link>
              </Menu.Item>
            )
          }
        </SubMenu>
        <SubMenu title="ES 8" key="es8">
          {
            Object.values(ES8Feature).map(item => 
              <Menu.Item key={item.key}>
                <Link href={`/es8/${item.key}`}>
                  <a>{item.name}</a>
                </Link>
              </Menu.Item>
            )
          }
        </SubMenu>
        <SubMenu title="ES 9" key="es9">
          {
            Object.values(ES9Feature).map(item => 
              <Menu.Item key={item.key}>
                <Link href={`/es9/${item.key}`}>
                  <a>{item.name}</a>
                </Link>
              </Menu.Item>
            )
          }
        </SubMenu>
        <SubMenu title="ES 10" key="es10">
          {
            Object.values(ES10Feature).map(item => 
              <Menu.Item key={item.key}>
                <Link href={`/es10/${item.key}`}>
                  <a>{item.name}</a>
                </Link>
              </Menu.Item>
            )
          }
        </SubMenu>
        <SubMenu title="ES 11" key="es11">
          {
            Object.values(ES11Feature).map(item => 
              <Menu.Item key={item.key}>
                <Link href={`/es11/${item.key}`}>
                  <a>{item.name}</a>
                </Link>
              </Menu.Item>
            )
          }
        </SubMenu>
      </Menu>
    );
  }
}
