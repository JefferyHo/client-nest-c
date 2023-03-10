import { View, Image, Text, Button, ScrollView } from '@tarojs/components'
import { useRef, useState } from 'react'
import { getAppList, removeApp } from '../../api/users'
import { ApiData } from '../../api/http'
import Empty from '../../components/Empty';
import './index.scss'
import * as moment from 'moment/moment';
import Taro, { useDidShow } from '@tarojs/taro';

interface ListItem {
  id: number,
  avatar: string,
  name: string,
  label: object,
  createDate: string
}

const PatchRestResult = (res: ApiData): any => {
  const { code, message, data } = res;

  if (code !== 200) {
    Taro.showToast({
      title: message,
      icon: 'error'
    });
    return;
  }

  return data;
}

function Index() {

  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);

  const selectedId = useRef(-1);
  const selectedName = useRef("");

  const getList = () => {
    getAppList()
      .then(PatchRestResult).then(data => {
        setList(data);
      })
  }


  useDidShow(() => {
    getList();
  });

  const handleClick = (e, id: number, name: string) => {
    selectedId.current = id;
    selectedName.current = name;
    setShow(true);
    e.stopPropagation();
  }

  const handleEdit = () => {
    console.log(selectedId.current);
  }

  const handleRmv = (e) => {
    Taro.showActionSheet({
      alertText: `Confrim to delete the app [${selectedName.current}]`,
      itemList: ['Confirm'],
      success: (result: any) => {
        const { tapIndex } = result;

        if (tapIndex === 0) {
          removeApp(selectedId.current)
          .then(PatchRestResult)
          .then(() => {
            Taro.showToast({
              title: 'success',
              icon: 'success'
            });
            getList();
          })
        }
      },
      fail: () => {
        
      }
    })
    console.log(selectedId.current);
  }

  const handleAdd = () => {
    Taro.navigateTo({
      url: '/pages/apps/index'
    });
  }

  return (
    <View className='index' onClick={() => setShow(false)}>
      <View className='add-wpt'>
        <Button className='add-btn' type='primary' onClick={handleAdd}>新增APP</Button>
      </View>
      <ScrollView
        className='cont-wpt'
        scrollY
        scrollWithAnimation
      >
        {
          list.length > 0 
          ? list.map((l: ListItem) => (
            <View className='app-item' key={l.id}>
              <Image src={l.avatar} className='app-item__image' />
              <View className='app-item__cont'>
                <View className='app-item__left'>
                  <Text className='app-item__text'>{l.name }</Text>
                  <Text className='app-item__date'>{moment(l.createDate).format('YYYY/MM/DD hh:mm')}</Text>
                </View>
                <View className='app-item__right' onClick={(e) => handleClick(e, l.id, l.name)}>
                  ...
                </View>
              </View>
            </View>
          ))
          : <Empty />
        }
      </ScrollView>
      {
        show && (<View className='index-modal'>
          <View className='btn-wpt'>
            <Text className='index-model__edit' onClick={handleEdit}>编辑</Text>
            <Text className='index-model__rmv' onClick={handleRmv}>删除</Text>
          </View>
      </View>)
      }
      
    </View>
  )
}
export default Index;