import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../sagas/.';
import moment from 'moment';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
  LOAD_MATCHS_REQUEST,
  LOAD_MATCHS_HISTORY_REQUEST,
} from '../sagas/match';

import {
  Table,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Empty,
  Spin,
  Result,
  Avatar,
} from 'antd';

import { AlignCenterOutlined, SyncOutlined } from '@ant-design/icons';
import SizeContext from 'antd/lib/config-provider/SizeContext';
import Notification from '../components/Notification';
import { useRouter } from 'next/router';
require('moment-timezone');

// const limit = 100;
moment.tz.setDefault('Asia/Seoul');
const time_format = 'YYYY/MM/DD-HH:mm A';
const nowTime = moment().format(time_format);

const matchings = () => {
  const router = useRouter();

  const columns = [
    // {
    //   title: 'key',
    //   dataIndex: 'key',
    //   key: 'key',
    //   align: 'center',
    //   width: 50,
    // },
    //homeTeamLogoUrl
    //awayTeamLogoUrl
    {
      title: 'homeTeam',
      dataIndex: 'homeTeam',
      key: 'homeTeam',
      align: 'right',
      width: 200,
      render(text, record) {
        return {
          props: {
            style: { color: '#2c3e50' },
          },
          children: (
            <div>
              <strong>{text}</strong>
              <Avatar
                size={40}
                src={record.homeTeamLogoUrl}
                style={{
                  backgroundColor: 'transparent',
                  // backgroundColor: 'rgba( 255, 255, 255, 0.7)',
                  marginLeft: '10px',
                }}
              />
            </div>
          ),
        };
      },
    },
    {
      title: 'awayTeam',
      dataIndex: 'awayTeam',
      key: 'awayTeam',
      align: 'left',
      width: 200,
      render(text, record) {
        return {
          props: {
            style: { color: '#2c3e50' },
            // style: { color: '#4b0763' },
            // style: { color: 'red' },
          },
          children: (
            <div>
              <Avatar
                size={40}
                src={record.awayTeamLogoUrl}
                style={{
                  backgroundColor: 'transparent',
                  marginRight: '10px',
                }}
              />
              <strong>{text}</strong>
            </div>
          ),
        };
      },
    },
    {
      title: '배팅인원',
      dataIndex: 'howManyPeopleBatted',
      key: 'howManyPeopleBatted',
      align: 'center',
      width: 50,
      render: (text, record) => {
        return {
          props: {
            style: { color: parseInt(text) > 0 ? '#e84118' : '#353b48' },
          },
          children: (
            <div>
              <strong>{text}</strong>
            </div>
          ),
        };
      },
      // sorter: (a, b) => a.howManyPeopleBatted - b.howManyPeopleBatted,
    },
    {
      title: 'startTime',
      dataIndex: 'startTime',
      key: 'startTime',
      align: 'center',
      width: 150,
      // rowClassName={},
      render: (startTime, record) => {
        return {
          props: {
            style: {
              color: '#4b0763',
            },
          },
          children: (
            <div>
              <strong>{startTime}</strong>
            </div>
          ),
        };
      },
    },
    {
      title: '배팅',
      dataIndex: '_id',
      key: '_id',
      width: 100,
      align: 'left',
      render: (_id, record) => {
        return (
          <>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                router.push(
                  {
                    pathname: 'match',
                    query: { matchid: _id },
                  }
                  // `/match/${record.key}`
                  // asPath 주소창에 보이는 주소 설정
                );
              }}
              danger
              // style={{ marginLeft: '5px' }}
            >
              배팅
            </Button>
            {nowTime > record.startTime ? (
              <Tag style={{ marginLeft: '1em' }} color="#ff1e00">
                {/* 마감 */}
                Close
              </Tag>
            ) : nowTime > record.deadLine ? (
              <Tag style={{ marginLeft: '1em' }} color="#e04612">
                {/* 마감 5분 전 */}
                5 Minutes
              </Tag>
            ) : nowTime > record.deadLine_1 ? (
              <Tag style={{ marginLeft: '1em' }} color="#e08312">
                {/* 마감 1시간 전 */}
                1 Hour
              </Tag>
            ) : nowTime > record.deadLine_24 ? (
              <Tag style={{ marginLeft: '1em' }} color="#00bfa6">
                {/* 마감 하루 전 */}
                1 Day
              </Tag>
            ) : nowTime > record.deadLine_7d ? (
              <Tag style={{ marginLeft: "1em"}} color="#8c00bf">
                {/* 마감 일주일 전 */}
                1 Week
              </Tag>
            ): null}

            {nowTime > record.startTime && nowTime < record.finishTime ? (
              <Tag style={{ marginLeft: '1em' }} color="#b52278">
                {/* 게임 중  // api finishTime 이상함 강제로 2시간 후 종료  */}
                In game
              </Tag>
            ) : null}
          </>
        );
      },
    },
  ];
  const { me } = useSelector((state) => state.user);
  const { matchs, matchsHistory } = useSelector((state) => state.match);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!me) {
      // Notification('로그인이 필요합니다!');  새로고침하면 왜 로그인 하라고 뜰까? me가 왜없냐
      // <Alert message="로그인이 필요합니다!" type="warning" showIcon closable />;
      // alert('로그인이 필요합니다!');
      // router.push('/');
    }
    dispatch({ type: LOAD_MATCHS_REQUEST });
    dispatch({ type: LOAD_MATCHS_HISTORY_REQUEST });
    // dispatch({ type: LOAD_MATCHS_REQUEST, index: -1 });
  }, [me]);

  if (!matchs)
    return (
      <Spin style={{ marginTop: '3rem', SizeContext: '10rem' }} size="large" />
    );

  if (matchs?.length < 0)
    return (
      <Row>
        <Row>로딩 중</Row>
        <Row>
          {/* <Table columns={columns} /> */}
          <Result status="warning" title="경기를 불러오지 못하였습니다!" />
        </Row>
      </Row>
    );
  let matchsData = [];
  for (let i = 0; i < matchs?.length; i++) {
    matchsData.push({
      key: i + 1,
      ...matchs[i],
      startTime: moment(matchs[i].startTime).format(time_format),
      finishTime: moment(matchs[i].finishTime).format(time_format),
      deadLine: moment(matchs[i].startTime)
        .subtract(5, 'minutes')
        .format(time_format),
      deadLine_1: moment(matchs[i].startTime)
        .subtract(1, 'hours')
        .format(time_format),
      deadLine_24: moment(matchs[i].startTime)
        .subtract(1, 'd')
        .format(time_format),
      deadLine_7d: moment(matchs[i].startTime)
        .subtract(7, 'd')
        .format(time_format),
      // 마감시간 설정
      howManyPeopleBatted:
        matchs[i].homeBattingNumber +
        matchs[i].awayBattingNumber +
        matchs[i].drawBattingNumber,
    });
  }

  let matchsHistoryData = [];
  for (let i = 0; i < matchsHistory?.length; i++) {
    matchsHistoryData.push({
      key: i + 1,
      ...matchsHistory[i],
      startTime: moment(matchsHistory[i].startTime).format(time_format),
      finishTime: moment(matchsHistory[i].startTime).add(2, "h").format(time_format),
      deadLine: moment(matchsHistory[i].startTime)
        .subtract(5, 'minutes')
        .format(time_format),
      howManyPeopleBatted:
        matchsHistory[i].homeBattingNumber +
        matchsHistory[i].awayBattingNumber +
        matchsHistory[i].drawBattingNumber,
    });
  }
  
  return (
    <Row
      style={{
        textAlign: 'center',
        // padding: '20px',
        backgroundColor: 'white',
        //테이블 row들 왜 투명이냐 ..? Table 스타일로 수정
      }}
      justify="space-around"
    >
      <Row style={{ backgroundColor: 'white', padding: '20px' }}>
        <Row>
          <h2>진행 중</h2>
        </Row>
        <Table
          style={{ backgroundColor: 'white' }}
          columns={columns}
          dataSource={matchsData} // 현재 시간 이후의 배팅 // 진행 중
          pagination={{ pageSize: 5 }}
          // scroll={{ y: 300 }}
          rowClassName="currentBattingRowTable"
          bordered
        />
        <Row>
          <h2>지난 배팅</h2>
        </Row>
        <Table
          style={{ backgroundColor: 'white' }}
          columns={columns}
          dataSource={matchsHistoryData.slice(0).reverse()} // 현재 시간 이전의 배팅 // 지난배팅
          pagination={{ pageSize: 5 }}
          rowClassName={(record, index) => 'prevBattingRowTable'}
          // scroll={{ x: 50 }}
          bordered
        />
      </Row>
    </Row>
  );
};

export default matchings;
