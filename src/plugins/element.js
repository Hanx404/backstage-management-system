/**
 * @Author: Fan
 * @Date: 2021-11-24 11:29:04
 * @LastEditTime: 2022-01-12 11:52:12
 * @LastEditors: your name
 * @Description:
 * @FilePath: \vue后台管理\src\plugins\element.js
 * @焯!
 */
import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Main, Header, Aside, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select, Option, Cascader, Alert, Tabs, TabPane, Steps, Step, CheckboxGroup, Checkbox, Upload, Timeline, TimelineItem } from 'element-ui'

Vue.use(Button).use(Form).use(FormItem).use(Input).use(Container).use(Header).use(Aside).use(Main).use(Menu).use(Submenu).use(MenuItem).use(Breadcrumb).use(BreadcrumbItem).use(Card).use(Row).use(Col).use(Table).use(TableColumn).use(Switch).use(Tooltip).use(Pagination).use(Dialog).use(Tag).use(Tree).use(Select).use(Option).use(Cascader).use(Alert).use(Tabs).use(TabPane).use(Steps).use(Step).use(CheckboxGroup).use(Checkbox).use(Upload).use(Timeline).use(TimelineItem)

// 弹窗提示S
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
