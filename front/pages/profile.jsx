import React, { useEffect } from 'react';
import { Row, Col, Avatar, Alert, notification, Card } from 'antd';
import { wrapper } from '../store';
import styled from 'styled-components';
import { LOAD_USER_REQUEST, LOAD_BATTING_USER_REQUEST } from '../sagas/user';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import Notification from '../components/Notification';
import ProfileBattingLine from '../components/ProfileBattingLine';

const profileCardStyle = {
  backgroundColor: '#c8d6e5',
  margin: '1rem',
  padding: '5px',
  borderRadius: '10px',
  boxShadow:
    '0 9px 8px 1px rgba(0, 0, 0, 0.2), 0 6px 20px 1px rgba(0, 0, 0, 0.19)',
};

const BattingsCard = styled.div`
  background-color: #f6f6f6;
  border-radius: 10px;
  margin: 0 1rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;
const profile = () => {
  const { me, battingUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const router = useRouter();
  const { userid } = router.query;
  useEffect(() => {
    if (!me) {
      // Notification('로그인이 필요합니다!');
      <Alert message="로그인이 필요합니다!" type="warning" showIcon closable />;
      // router.push('/');
    }
  }, [me]);

  useEffect(() => {
    dispatch({ type: LOAD_BATTING_USER_REQUEST, data: userid });
  }, [userid, me]);
  return (
    <>
      <Row
        style={{
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
      >
        <Col span={14} style={profileCardStyle}>
          <Col span={8}>
            <Avatar size={100} src="/images/profile.jpg" />
          </Col>
          <Col span={16}>
            <h2>
              <b>{battingUser?.nickname}</b>
            </h2>
            <h2>
              <b>포인트 : </b>
              {battingUser?.point}점
            </h2>
          </Col>
        </Col>
        <Col span={16}>
          <Card
            style={{
              borderRadius: '50%',
              width: '10%',
              height: '10%',
              backgroundColor: '#c8d6e5',
              textAlign: 'center',
              boxShadow: '1px 1px 1px 1px gray',
            }}
          >
            <h2>
              <b>랭킹 : </b>
              {battingUser?.rank}위
            </h2>
          </Card>
        </Col>
      </Row>
      <BattingsCard>
        <Row>
          <Col span={24}>
            <h1>적중내역</h1>
          </Col>
        </Row>
        <Row>
          <Row>
            <Col span={8}>
              <h2>경기</h2>
            </Col>
            <Col span={8}>
              <h2>베팅</h2>
            </Col>
            <Col span={4}>
              <h2>결과</h2>
            </Col>
            <Col span={4}>
              <h2>날짜</h2>
            </Col>
          </Row>
          {/* api/user/{me.id} */}
          {battingUser?.battings
            ?.slice(0)
            .reverse()
            .map((batting) => (
              <ProfileBattingLine batting={batting}></ProfileBattingLine>
            ))}
        </Row>
      </BattingsCard>
    </>
  );
};

export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
  store.dispatch({ type: LOAD_USER_REQUEST, me: true, id: 1 });
});

export default profile;
