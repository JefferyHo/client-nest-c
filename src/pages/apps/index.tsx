import { View, Image, Text, Picker, Form, Input, Button } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import { getLabelList, addApp } from '../../api/users'
import { ApiData } from '../../api/http'
import './index.scss'
import Taro from '@tarojs/taro'

interface LabelItem {
  id: number,
  name: string,
  info: string
}

function Apps() {
  const [name, setName] = useState<string>("");
  const [list, setList] = useState<LabelItem[]>([]);
  const [label, setLabel] = useState<number | string>();
  const [url, setUrl] = useState<string>("");
  const [src, setSrc] = useState<string>("");

  const labelId: any = useRef()

  const fileObj: any = useRef()

  const getList = () => {
    getLabelList()
      .then((res: ApiData) => {
        const { code, data = [], message } = res;

        if (code === 200) {
          setList(data);
          return;
        }

        console.error(message);
      })
  }

  useEffect(() => {
    getList();
  }, []);

  const formSubmit = () => {
    if (!(name && label && url && src)) {
      Taro.showToast({
        title: 'please complete the form',
        icon: 'none'
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('label', labelId.current);
    formData.append('url', url);
    formData.append('avatar', fileObj.current);

    addApp(formData).then(res => {
      const { code, message } = res;
      if (code !== 200) {
        Taro.showToast({
          title: message,
          icon: 'none'
        });
      }
      setTimeout(() => {
        Taro.navigateBack();
      }, 1000);
      Taro.showToast({
        title: '添加成功',
        icon: 'success'
      });
    })
  }

  const handleLabelChange = (e) => {
    const index = e.detail.value;
    labelId.current = list[index].id
    setLabel(list[index].name);
  }

  const chooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res);
        let tempFilePath = res.tempFilePaths;
        fileObj.current = res.tempFiles[0].originalFileObj;
        console.log(tempFilePath);
        setSrc(tempFilePath[0]);
      }
    })
  }

  return (
    <View className='apps'>
      <View className='title'>APP INFO</View>
      <View className='form-wpt'>
        <Form onSubmit={formSubmit}>
          <View className='form-item'>
            <Text>Name</Text>
            <Input type='text' value={name} placeholder='please input name' onInput={e => setName(e.detail.value)} />
          </View>
          <View className='form-item'>
            <Text>Label</Text>
            <Picker mode='selector' range={list} rangeKey='name' onChange={handleLabelChange}>
              <Text>{ label || 'please select label'}</Text>
            </Picker> 
          </View>
          <View className='form-item'>
            <Text>Url</Text>
            <Input type='text' value={url} placeholder='please input url' onInput={e => setUrl(e.detail.value)} />
          </View>
          <View className='form-item'>
            <Text>Avatar</Text>
            <View className='upload-wpt'>
              { src && <Image mode='widthFix' className='img' src={src} />  }
              <View className='img-add' onClick={chooseImage}>
                +
              </View>
            </View>
          </View>
          <View className='form-item'>
            <Button type='primary' formType='submit'>提交</Button>
          </View>
        </Form>
      </View>
    </View>
  )
}
export default Apps;