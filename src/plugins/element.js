import Vue from 'vue';
import {
  Avatar,
  Button,
  Row,
  Col,
  Form,
  FormItem,
  Input,
  Message,
  MessageBox,
} from 'element-ui';
import './theme/index.css';

Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Avatar);

Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;