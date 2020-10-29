import '../styles/globals.css';
import Head from 'next/head';
import Link from 'next/link';

import MyLayout from '../components/MyLayout';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { wrapper } from '../store';
import { useEffect } from 'react';
import { LOAD_USER_REQUEST } from '../sagas/user';
import moment from 'moment';
import { LOAD_MAIN_MATCHS_REQUEST } from '../sagas/match';
import { useDispatch, useSelector } from 'react-redux';

import { Router } from 'next/router';

import NProgress from "nprogress";
import "nprogress/nprogress.css"

require('moment-timezone');

Router.events.on("routeChangeStart", ()=>{
  NProgress.start();
})
Router.events.on("routeChangeComplete", ()=>{
  NProgress.done();
})
Router.events.on("routeChangeError", ()=>{
  NProgress.done();
})
const MyApp = ({ Component, pageProps }) => {
  // const router = useRouter();
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    const tokenValue = sessionStorage.getItem('sd');
    // console.log('tokenValue => ', tokenValue);
    if (tokenValue) {
      axios.defaults.headers.common['x-access-token'] = tokenValue;
      axios.defaults.headers.common['Content-Type'] = 'application/json';
    }
    moment.tz.setDefault('Asia/Seoul');
    if (!me) {
      dispatch({
        type: LOAD_USER_REQUEST,
        data: {
          me: true,
        },
      });
    }
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <title>스포츠 도도</title>
        <link
          rel="icon"
          type="image/x-icon"
          // type="image/x-icon"
          sizes="16x16"
          href="images/dodo.ico"
          // href="/images/favicon2.ico"
        ></link>

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
        ></link>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        ></link>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>
      <MyLayout me={me}>
        <Component {...pageProps} />
      </MyLayout>
    </>
  );
};

MyApp.getInitialProps = (context) => {
  // 쿠키로 하는 가능성도 열어놨다.
  // const cookie = new Cookies();
  // const tokenValue = cookie.get('sd');
  // if (tokenValue) {
  //   axios.defaults.headers.common['x-access-token'] = tokenValue;
  //   axios.defaults.headers.common['Content-Type'] = 'application/json';
  // }
  // const { ctx } = context;
  // const state = ctx.store.getState();
  // // 서버일때만 쿠키 준다 (클라이언트일때는 알아서 쿠키 줌)
  // if (!state.user.me) {
  //   ctx.store.dispatch({
  //     type: LOAD_USER_REQUEST,
  //     data: {
  //       me: true,
  //     },
  //   });
  // }
};

export default wrapper.withRedux(MyApp);
