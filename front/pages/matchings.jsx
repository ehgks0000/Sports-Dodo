import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
// import Match from 'Match';
import { BACKEND_URL } from '../sagas/.';
import moment from 'moment';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_MATCHS_REQUEST } from '../sagas/match';

import { Table, Tag, Space, Button } from 'antd';

import { AlignCenterOutlined, SyncOutlined } from '@ant-design/icons';
import SizeContext from 'antd/lib/config-provider/SizeContext';
const { Column, ColumnGroup } = Table;

// 가까운 시간순서
// const url = "http://localhost:80/posts?_sort=match_date&_order=ASC";
// axios.defaults.baseURL = `${BACKEND_URL}/api`;

// const limit = 100;
function matchings() {
  const columns = [
    {
      title: 'key',
      dataIndex: 'key',
      key: 'key',
      align: 'center',
      width: 100,
    },
    {
      title: 'homeTeam',
      dataIndex: 'homeTeam',
      key: 'kehomeTeamy',
      align: 'center',
    },
    {
      title: 'awayTeam',
      dataIndex: 'awayTeam',
      key: 'awayTeam',
      align: 'center',
    },
    {
      title: 'startTime',
      dataIndex: 'startTime',
      key: 'startTime',
      align: 'center',
      // sorter: (a, b) => a.startTime - b.startTime,
    },
    {
      title: 'finishTime',
      dataIndex: 'finishTime',
      key: 'finishTime',
      align: 'center',
    },
    {
      title: '배팅인원',
      dataIndex: 'howManyPeopleBatted',
      key: 'howManyPeopleBatted',
      align: 'center',
      // render: (howManyPeopleBatted) => (

      // ),
      // sorter: (a, b) => a.numOfbatting - b.numOfbatting,
    },
    // {
    //   title: "배팅인원",
    //   dataIndex: "numOfbatting",
    //   key: "numOfbatting",
    //   align: "center",
    // },
    {
      title: '배팅',
      dataIndex: '_id',
      key: '_id',
      align: 'center',
      render: (_id) => (
        <Link href={{ pathname: 'Match', query: { matchid: _id } }}>
          <a>
            <Button type="primary" htmlType="submit" danger>
              배팅하기
            </Button>
          </a>
        </Link>
      ),
    },
  ];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: LOAD_MATCHS_REQUEST });
    // dispatch({ type: LOAD_MATCHS_REQUEST, index: -1 });
  }, []);
  const { matchs } = useSelector((state) => state.match);

  // const [matchs, setMatchs] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchMatchs = async () => {
  //     try {
  //       setError(null);
  //       setMatchs(null);
  //       setLoading(true);

  //       const response = await axios.get(`/match?limit=${limit}`);
  //       // 데이터는 response.data 안에 들어있습니다.
  //       setMatchs(response.data.data);
  //     } catch (e) {
  //       setError(e);
  //     }
  //     setLoading(false);
  //   };

  //   fetchMatchs();
  // }, []);

  // if (loading) return <SyncOutlined spin style={{ fontSize: '100px' }} />;
  if (matchs?.length < 0)
    return (
      <div>
        <div>에러가 발생했습니다</div>
        <div>
          <Table columns={columns} />
        </div>
      </div>
    );
  if (!matchs) return null;

  const data = [];
  // myArray.slice(0).reverse().map
  for (let i = 0; i < matchs.length; i++) {
    data.push({
      key: i + 1,
      ...matchs[i],
      startTime: moment(matchs[i].startTime).format('MM.DD HH:MM'),
      finishTime: moment(matchs[i].finishTime).format('MM.DD HH:MM'),
    });
  }

  console.log(data[67]?._id);
  return (
    <div
      style={{
        marginLeft: 50,
        marginRight: 50,
        paddingTop: 100,
      }}
    >
      <Table columns={columns} dataSource={data.slice(0).reverse()} bordered />
    </div>
  );
}

export default matchings;
