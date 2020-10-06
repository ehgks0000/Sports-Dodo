import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import styled from 'styled-components';
import axios from 'axios';
import { BACKEND_URL } from '../sagas';
import MatchTest from '../components/MatchTest';
import Notification from '../components/Notification';
import { LOAD_BATTING_HISTORY_REQUEST } from '../sagas/batting';
import { useDispatch, useSelector } from 'react-redux';
import BattingUserList from '../components/BattingUserList';
import {
  Form,
  Input,
  Radio,
  Row,
  Col,
  Avatar,
  InputNumber,
  Button,
  Divider,
  message,
} from 'antd';
import { FlexDiv } from '../styles/styled-components';
import { AlignCenterOutlined, SyncOutlined } from '@ant-design/icons';

axios.defaults.baseURL = `${BACKEND_URL}/api`;
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
const nowTime = moment().format();

const ProgressBar = styled(FlexDiv)`
  width: ${(props) => props.width || 'auto'};
  background-color: ${(props) => props.backColor || 'inherit'};
  padding: 5px;
  margin-bottom: 1rem;
  border-radius: 2px;
`;

const getProgressBarWidth = (h, d, a) => {
  const total = h + d + a;
  if (!total) return null;
  const home = `${Math.floor((h / total) * 80)}%`;
  const draw = `${Math.floor((d / total) * 80)}%`;
  const away = `${Math.floor((a / total) * 80)}%`;
  return {
    home: home === '0%' ? 'auto' : home,
    draw: draw === '0%' ? 'auto' : draw,
    away: away === '0%' ? 'auto' : away,
  };
};

const getOdds = (h, d, a, point, where) => {
  const total = h + d + a + point;
  if (!total)
    return {
      home: '미정',
      draw: '미정',
      away: '미정',
    };
  if (where === 'Home') h += point;
  if (where === 'Away') a += point;
  if (where === 'Draw') d += point;
  const home = h === 0 ? 0 : (total / h).toFixed(2);
  const draw = d === 0 ? 0 : (total / d).toFixed(2);
  const away = a === 0 ? 0 : (total / a).toFixed(2);
  return {
    home,
    draw,
    away,
  };
};

const fetchApi = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const divideHistory = (bat_history) => {
  const object = {
    home: [],
    draw: [],
    away: [],
  };
  bat_history?.map((e) => {
    const array = {
      userid: e?.user,
      chooseHomeAwayDraw: e?.chooseHomeAwayDraw,
      battingPoint: e?.battingPoint,
    };
    // data.push(array);
    e?.chooseHomeAwayDraw === 'Home'
      ? object.home.push(array)
      : // ? setHomeHistory(...(e?.user, e?.chooseHomeAwayDraw, e?.battingPoint))
      e?.chooseHomeAwayDraw === 'Draw'
      ? object.draw.push(array)
      : object.away.push(array);
  });
  // console.log(object);
  return object;
};

const match = () => {
  const router = useRouter();
  const { matchid } = router.query;

  const { me } = useSelector((state) => state.user);
  const { battingHistory } = useSelector((state) => state.batting);
  const dispatch = useDispatch();
  // 리덕스 배팅 내역 부르는거 오류
  // console.log(battingHistory);
  // const userPoint = me ? me.point : 0;
  const [userPoint, setUserPoint] = useState(0);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [match, setMatch] = useState(null);
  const [bpoint, setBpoint] = useState([]);
  const [choose, setChoose] = useState('Home');
  const [battingpoint, setBattingpoint] = useState(0);
  const [odds, setOdds] = useState({});

  const [homeImg, setHomeImg] = useState('/images/epl_logo.png');
  const [awayImg, setAwayImg] = useState('/images/epl_logo.png');
  const fullScreenImg = '../public/images/epl_emblems_collection.jpg';

  const [dividedHistory, setDividedHistory] = useState({});
  //한 매치에 대한 히스토리
  useEffect(() => {
    dispatch({
      type: LOAD_BATTING_HISTORY_REQUEST,
      data: matchid,
    });
  }, []);

  useEffect(() => {
    setDividedHistory(divideHistory(battingHistory));
  }, [battingHistory]);

  // console.log(battingHistory);
  useEffect(() => {
    setUserPoint(me?.point);
    if (!me) {
      // Notification('로그인이 필요합니다!');
      // <Alert message="로그인이 필요합니다!" type="warning" showIcon closable />;
      // alert('로그인이 필요합니다!');
      // router.push('/');
    }
    if (matchid) {
      const match = fetchApi(`/match/${matchid}`);
      const point = fetchApi(`/match/${matchid}/batting`);

      Promise.all([match, point]).then((v) => {
        setMatch(v[0].data);
        setHomeImg(v[0].data.homeTeamLogoUrl);
        setAwayImg(v[0].data.awayTeamLogoUrl);
        setBpoint(v[1]);
      });
    }
  }, [matchid, me]);

  // 배당률 계산
  useEffect(() => {
    setOdds(
      getOdds(
        homeTotalPoint,
        drawTotalPoint,
        awayTotalPoint,
        battingpoint,
        choose
      )
    );
  }, [bpoint, battingpoint, choose]);

  const homeTeam = match?.homeTeam;
  const awayTeam = match?.awayTeam;

  const startTime = moment(match?.startTime).format('MM/DD hh:mm');
  const deadLine = moment(match?.startTime).subtract(5, 'minutes').format();

  const homeTotalPoint = bpoint?.battingPoints?.homeTotalPoint;
  const awayTotalPoint = bpoint?.battingPoints?.awayTotalPoint;
  const drawTotalPoint = bpoint?.battingPoints?.drawTotalPoint;

  const percents = getProgressBarWidth(
    homeTotalPoint,
    drawTotalPoint,
    awayTotalPoint
  );
  //배당률 전체/
  // testnum.toFixed(0);  소수점 버리기 반올림

  //적중률
  const hitOdds =
    choose === 'Home'
      ? (odds?.home * battingpoint).toFixed(2)
      : choose === 'Away'
      ? (odds?.away * battingpoint).toFixed(2)
      : (odds?.draw * battingpoint).toFixed(2);

  const round = match?.round;
  // const referee = if;
  const referee = () => {
    if (match?.referee === null) {
      return '미정';
    } else {
      return match?.referee;
    }
  };
  const venue = match?.venue;

  const handleChooseChange = (e) => {
    setChoose(e.target.value);
  };

  const handlebattingpointChange = (e) => {
    if (e > userPoint) {
      return Notification('가진 포인트보다 배팅을 많이 했습니다.');
    }
    if (e % 10 !== 0) {
      return Notification('10p의 단위로 베팅이 가능합니다.');
    }
    setBattingpoint(e);
  };

  const handleSubmit = async () => {
    if (battingpoint === 0) {
      return message.error('0 포인트는 베팅할 수 없습니다!');
    }
    try {
      await axios
        .post(`/match/${matchid}/batting`, {
          homeTeamName: homeTeam,
          awayTeamName: awayTeam,
          chooseHomeAwayDraw: choose,
          battingPoint: battingpoint,
        })
        .then((res) => {
          console.log(res);
          Notification('배팅을 완료 하였습니다!');
          // <Alert message="배팅을 완료 하였습니다." type="success" showIcon />;
          router.reload();
        })
        .catch((err) => {
          console.log(err);
          Notification('배팅에 오류가 발생 하였습니다!');
          router.reload();
          // <Alert message="배팅 시간이 지났습니다." type="error" showIcon />;
        });
      Notification('배팅을 완료 하였습니다!');
      router.reload();
    } catch (e) {
      message.error(e.response.data ? e.response.data.error : '오류 발생!');
    }
    console.log('submit 끝');
  };

  return (
    <Row className="matchFullScreenImg">
      <Row
        style={{
          height: '100%',
          backgroundColor: 'rgba( 255, 255, 255, 0.8 )',
        }}
      >
        <Row style={{ margin: '2rem' }}>
          <strong>{round}</strong>
        </Row>
        <Row
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            //수직 가운데 정렬
          }}
        >
          <Col span={10}>
            <Row>
              <Avatar
                size={100}
                src={homeImg}
                style={{ backgroundColor: 'transparent' }}
              />
            </Row>
            <Row>
              <h2>{homeTeam}</h2>
            </Row>
            <Row>
              <h4>
                {match?.homeInfo?.matchs?.wins?.total}승{' '}
                {match?.homeInfo?.matchs?.draws?.total}무{' '}
                {match?.homeInfo?.matchs?.loses?.total}패
              </h4>
            </Row>
            <Row>
              {/* <h4>{goalsHomeTeam}</h4> */}
              {/* 추후에 수정 */}
            </Row>
          </Col>
          <Col span={4}>
            <Row>
              <h1>VS</h1>
            </Row>
            <Row>
              <h4>{startTime}</h4>
            </Row>
            {/* <Row>
              <h4>마감시간 {deadLine}</h4>
            </Row> */}

            {/* 장소 */}
          </Col>
          <Col span={10}>
            <Row>
              <Avatar
                size={100}
                src={awayImg}
                style={{ backgroundColor: 'transparent' }}
              />
            </Row>
            <Row>
              <h2>{awayTeam}</h2>
            </Row>
            <Row>
              <h4>
                {match?.awayInfo?.matchs?.wins?.total}승{' '}
                {match?.awayInfo?.matchs?.draws?.total}무{' '}
                {match?.awayInfo?.matchs?.loses?.total}패
              </h4>
            </Row>
            {/* <Row> */}
            {/* <h4>{goalsAwayTeam}</h4> */}
            {/* c */}
            {/* </Row> */}
          </Col>
        </Row>
        <Row style={{ marginBottom: '2rem' }}>
          <strong>
            <Row>{venue}</Row>
            <Row>주심 : {referee()}</Row>
          </strong>
        </Row>
        <FlexDiv width="100%" direction="column">
          <FlexDiv>
            <h3>베팅상황</h3>
          </FlexDiv>
          <FlexDiv wrap="nowrap" width="80%" direction="row">
            <ProgressBar width={percents?.home} backColor="#51adcf">
              홈 : {homeTotalPoint} p
            </ProgressBar>
            <ProgressBar width={percents?.draw} backColor="#a5ecd7">
              무 : {drawTotalPoint} p
            </ProgressBar>
            <ProgressBar width={percents?.away} backColor="#e8ffc1">
              원정 : {awayTotalPoint} p
            </ProgressBar>
          </FlexDiv>
          <FlexDiv>
            <h3>배당률</h3>
          </FlexDiv>
          <div
            style={{
              width: '30%',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Col span={7}>
              <Button danger style={{ backgroundColor: '#51adcf' }}>
                {odds?.home}
              </Button>
            </Col>
            <Col span={7}>
              <Button danger style={{ backgroundColor: '#a5ecd7' }}>
                {odds?.draw}
              </Button>
            </Col>
            <Col span={7}>
              <Button
                danger
                style={{ backgroundColor: '#e8ffc1' }}
                color="black"
              >
                {odds?.away}
              </Button>
            </Col>
          </div>
          <p>* 베팅하시는 포인트에 따라 배당률이 달라질 수 있습니다.</p>
        </FlexDiv>
        <Divider />
        {/*  새 컴포넌트 만들기 */}
        <Form onFinish={handleSubmit}>
          <Row>
            {/* style={{ paddingTop: '2rem' }} */}
            <Radio.Group defaultValue="Home" buttonStyle="solid">
              <Radio.Button value="Home" onChange={handleChooseChange}>
                홈 승
              </Radio.Button>
              <Radio.Button value="Draw" onChange={handleChooseChange}>
                홈 무
              </Radio.Button>
              <Radio.Button value="Away" onChange={handleChooseChange}>
                홈 패
              </Radio.Button>
            </Radio.Group>
          </Row>
          <Row style={{ paddingTop: '1rem' }}>
            <InputNumber
              defaultValue={0}
              value={battingpoint}
              min={0}
              max={userPoint}
              step={10}
              onChange={handlebattingpointChange}
            />
          </Row>
          <Row style={{ paddingTop: '1rem' }}>
            예상 배당 포인트 : {hitOdds} p
          </Row>
          <Row>
            * 추후 다른 유저들의 베팅 결과에 따라 받는 포인트는 달라질 수
            있습니다.
          </Row>
          <Row style={{ padding: '1rem' }}>
            {nowTime > deadLine ? (
              <Button type="primary" danger>
                마감
              </Button>
            ) : (
              <Button type="primary" danger htmlType="submit">
                배팅
              </Button>
            )}
          </Row>
        </Form>
        <Divider>배팅한 사람들</Divider>
        {/* 디바이더 사용하기 */}
        <Row align="center">
          <Col span={7}>
            <Row style={{ marginBottom: '1rem' }}>
              <strong>Home</strong>
            </Row>
            {dividedHistory?.home?.map((data, i) => (
              <BattingUserList key={`home${i}`} data={data} />
            ))}
          </Col>
          {/* 홈팀 배팅한 사람들 */}
          <Col span={1}>
            <Divider type="vertical" />
          </Col>
          <Col span={7}>
            <Row style={{ marginBottom: '1rem' }}>
              <strong>Draw</strong>
            </Row>
            {dividedHistory?.draw?.map((data, i) => (
              <BattingUserList key={`draw${i}`} data={data} />
            ))}
          </Col>
          <Col span={1}>
            <Divider type="vertical" />
          </Col>
          <Col span={7}>
            <Row style={{ marginBottom: '1rem' }}>
              <strong>Away</strong>
            </Row>
            {dividedHistory?.away?.map((data, i) => (
              <BattingUserList key={`away${i}`} data={data} />
            ))}
          </Col>
        </Row>
      </Row>
    </Row>
  );
};
//match/id 검색
// user/userid/  >> filter((e)=>e.matchid ===match)   // chooseHomeAwayDraw
export default match;
