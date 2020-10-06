import React, { useState } from 'react';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import Link from 'next/link';

import {
  HomeOutlined, //홈 아이콘 추가
  AppstoreOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const A = styled.a`
  width: 100%;
`;

// 라우터 사용 시 주소창에 userid 노출됨 머지
const menuRouter = (router, href, id) => () => {
  id
    ? router.push(
        {
          pathname: `/${href}`,
          query: { userid: id },
        }
        // `/${href}/my`
        // asPath 설정 가능
        //as경로 설정시 주소창 직접 입력으로 왜 접속이 안될까?
      )
    : router.push({
        pathname: `/${href}`,
      });
};

const MainMenu = ({ visible }) => {
  const [isFold, setFold] = useState(false);
  const router = useRouter();
  const { me } = useSelector((state) => state.user);

  const handleMouseEnter = (e) => {
    setFold(true);
  };

  const handleMouseLeave = (e) => {
    setFold(false);
  };

  return (
    <div
      style={{
        zIndex: 100,
        position: 'fixed',
        top: '50px',
        width: 256,
      }}
    >
      {visible ? (
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={[]}
          mode="inline"
          theme="dark"
          inlineCollapsed={!isFold}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            backgroundColor: 'black',
          }}
        >
          {/* //홈 추가  홈링크 왜 안가지는지 모르겠음*/}
          <Menu.Item
            key="0"
            icon={<HomeOutlined />}
            onClick={() => {
              router.push('/');
              // router.push('/', '홈');
            }}
            // onClick={menuRouter(router, '/')}
          >
            홈
          </Menu.Item>

          <SubMenu key="sub1" icon={<DesktopOutlined />} title="매칭 보기">
            <Menu.Item key="1" onClick={menuRouter(router, 'matchings')}>
              축구
            </Menu.Item>
          </SubMenu>
          <Menu.Item
            key="2"
            icon={<ContainerOutlined />}
            onClick={menuRouter(router, 'profile', me?.id)}
          >
            베팅 내역
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<PieChartOutlined />}
            onClick={menuRouter(router, 'rankings')}
          >
            전체 랭킹
          </Menu.Item>
          <Menu.Item key="4" icon={<MailOutlined />}>
            <Link href="https://github.com/SeoSang/Sports-Dodo">
              <a target="_blank" rel="author">
                소개페이지
              </a>
            </Link>
          </Menu.Item>
        </Menu>
      ) : (
        <div
          style={{
            display: 'none',
          }}
        ></div>
      )}
    </div>
  );
};

export default MainMenu;
