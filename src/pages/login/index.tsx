import { useState } from 'react'
import { View, Text, Form, Label, Input, Button } from '@tarojs/components'
import { register, ApiData } from '../../api/users'
import './index.scss'
import Taro from '@tarojs/taro';

function Login() {
  const [username, setName] = useState<any>("");
  const [password, setPassword] = useState<string>("");

  const [msg, setMsg] = useState<string>("");

  function formSubmit(e:any) {
    if (!username) {
      setMsg('请输入用户名');
      return;
    }
    if (!password) {
      setMsg('请输入密码');
      return;
    }
    setMsg("");
    register({
      username,
      password
    }).then((res: ApiData) => {
      console.log(res)
      const { code, message, data } = res;
      Taro.setStorageSync('token', data['access_token']);
      if (code === 200) {
        Taro.showToast({
          title: '登录成功',
        });
        Taro.redirectTo({
          url: '/pages/index/index'
        })
        return;
      }

      Taro.showToast({
        title: message,
        icon: 'error'
      });
    }).catch(e => {
      console.log(e);
      const { statusText, data } = e.response;
      const { message } = data;

      Taro.showToast({
        title: message || statusText,
        icon: 'error'
      });
    })

  }

  function formReset(e) {
    console.log(e);
  }

  return (<View className='login'>
        <Text className='title'>Opps!!!</Text>
        <Form onSubmit={formSubmit} onReset={formReset} >
          <View className='form-body'>
            <Label className='form-body__label' for='username' key='1'>
              <Input id='username' type='text' placeholder='请输入用户名' value={username} onInput={e => setName(e.detail.value)} />
            </Label>
            <Label className='form-body__label' for='password' key='2'>
              <Input id='password' type='text' password={true} placeholder='请输入密码' value={password} onInput={e => setPassword(e.detail.value)} />
            </Label>
            {
              msg && <Text className='msg'>{ msg }</Text>
            }
            <View>
              <Text className='tip'>未注册手机号将自动注册</Text>
            </View>
            <View>
              <Button className='btn-submit' type='primary' formType='submit'>登录</Button>
            </View>
          </View>
        </Form>
      </View>
    )
}

export default Login;
