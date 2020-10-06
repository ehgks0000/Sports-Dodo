import { Col, Row } from 'antd';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { wrapper } from '../store';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_BATTING_USER_REQUEST } from '../sagas/user';
import { useEffect } from 'react';

const BattingUserList = ({ data }) => {
  const router = useRouter();
  const { battingUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { userid } = data;

  useEffect(() => {
    dispatch({
      type: LOAD_BATTING_USER_REQUEST,
      data: userid,
    });
  }, [userid]);

  return data ? (
    <Row>
      <Row style={{ fontSize: '1px', marginBottom: '5em' }}>
        <Col
          onClick={() => {
            router.push(
              {
                pathname: 'profile',
                query: { userid },
                // query: { userid, userid },
              },
              `profile/${battingUser?.nickname}`
            );
          }}
        >
          <a>
            {data?.userid}
            {battingUser?.name} / {battingUser?.nickname} /{data?.battingPoint}p
          </a>
          {/* 리덕스에서 이름 닉네임 왜 제대로 안불러옴?  */}
        </Col>
      </Row>
    </Row>
  ) : (
    <Row>데이터 없음</Row>
  );
};
// export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
//   store.dispatch({ type: LOAD_BATTING_USER_REQUEST, data: userid});
// });

export default BattingUserList;
