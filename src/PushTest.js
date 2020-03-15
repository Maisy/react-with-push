import React, { useState, useEffect } from 'react';
import { Button, TextField, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    '&> *': {
      margin: 8,
    },
  },
  executionWrapper: {
    display: 'flex',
    alignItems: 'center',
    '&> *': {
      margin: '0 8px',
    },
  },
});

const getFetchData = (url, divSelector, execFunc) => {
  fetch('getUrlData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, divSelector }),
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      const { contains } = myJson;
      if (!contains) {
        execFunc();
      } else {
        console.log('not yet opened.');
      }
      // console.log(JSON.stringify(myJson));
    });
};

export default function PushTest() {
  const classes = useStyles();
  const [allowedPerm, setAllowedPerm] = useState(false);
  const [url, setUrl] = useState(
    'https://smartstore.naver.com/teeprince/products/4734729346'
    //mask
    // 'https://smartstore.naver.com/mfbshop/products/4072435942'
  );
  const [divSelector, setDivSelector] = useState(
    '#content > div > div.prd_detail_basic > div.info > form > fieldset > div:nth-child(5) > div.prd_type3 > div.btn_order > span.buy > a > span'
    // '#wrap > div > div.prd_detail_basic > div.info > form > fieldset > div:nth-child(5) > div.prd_type3 > div.btn_order.v2 > span.buy > span'
  );
  const [timerId, setTimerId] = useState('');
  const [timerTime, setTimerTime] = useState(2000);

  useEffect(() => {
    Notification.requestPermission(async result => {
      if (result === 'granted') {
        setAllowedPerm(true);
      }
    });
  });

  const showNotification = async () => {
    try {
      if (!allowedPerm) {
        return alert('Please notification setting allowed.');
      }

      const registration = await navigator.serviceWorker.ready;
      registration.showNotification('Mask opened!', {
        // body: 'https://smartstore.naver.com/mfbshop/products/4072435942!',
        vibrate: [400, 100, 300, 100, 200, 100, 200],
        silent: false,
        // tag: 'vibration-sample-asdf',
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={classes.root}>
      <TextField
        label="Site url"
        disabled={timerId !== ''}
        defaultValue={url}
        onChange={e => setUrl(e.target.value)}
      ></TextField>
      <TextField
        label="divSelector (이게 없어지면 노티가 온다)"
        disabled={timerId !== ''}
        defaultValue={divSelector}
        onChange={e => setDivSelector(e.target.value)}
      ></TextField>
      <TextField
        label="몇초에 한번씩 확인할거냐"
        disabled={timerId !== ''}
        defaultValue={timerTime}
        onChange={e => setTimerTime(e.target.value)}
      ></TextField>

      <div className={classes.executionWrapper}>
        <Button
          variant="contained"
          color="primary"
          disabled={timerId !== ''}
          onClick={() => {
            if (timerId === '') {
              const timer = setInterval(
                () => getFetchData(url, divSelector, showNotification),
                timerTime
              );
              setTimerId(timer);
            }
          }}
        >
          Start~
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={timerId === ''}
          onClick={() => {
            if (timerId !== '') {
              clearInterval(timerId);
              setTimerId('');
            }
          }}
        >
          Stop!!
        </Button>
        <Typography>
          timer: {timerId ? `${timerTime / 1000}초마다 조회중` : '중지됨'}
        </Typography>
      </div>
      <div className={classes.executionWrapper}>
        Notification TEST:
        <Button variant="outlined" onClick={showNotification}>
          Allow Notification
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setTimeout(showNotification, 3000);
          }}
        >
          3초 후 notification test
        </Button>
      </div>
    </div>
  );
}
