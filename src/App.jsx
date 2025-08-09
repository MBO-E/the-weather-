import React from 'react';
import './App.css';

// react
import { useEffect, useState } from 'react';

// Material Ui Imports
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
// other librarys
import axios from 'axios';
import { format } from 'date-fns';
import { enUS as en, ar } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const theme = createTheme({
  typography: {
    fontFamily: ['IBM'],
  },
});

let cancelAxios = null;
function App() {
  const today = new Date();
  const { t, i18n } = useTranslation();

  // ============ States  ============
  const [dateAndTime, setDateAndTime] = useState('');
  const [temp, setTemp] = useState({
    number: null,
    description: '',
    min: null,
    max: null,
    icon: null,
  });

  const [locale, setLocale] = useState('ar');

  // ============ Event handlers  ============
  function handleLangClick() {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
  }

  // Update date format when locale changes
  useEffect(() => {
    setDateAndTime(format(today, 'PPPP', { locale: locale === 'en' ? en : ar }));
  }, [locale, today]);

  // Fetch weather data (runs only once on mount)
  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    axios
      .get(
        'https://api.openweathermap.org/data/2.5/weather?lat=30.033333&lon=31.233334&appid=4f292872d609284cc32352c5587e3ba6',
        { cancelToken: cancelToken.token }
      )
      .then(function (response) {
        const responseTemp = Math.round(response.data.main.temp - 272.15);
        setTemp({
          number: responseTemp,
          description: response.data.weather[0].description,
          min: Math.round(response.data.main.temp_min - 272.15),
          max: Math.round(response.data.main.temp_max - 272.15),
          icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
        });
      })
      .catch(function (error) {
        if (!axios.isCancel(error)) {
          console.log(error);
        }
      });

    return () => cancelToken.cancel();
  }, []);
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* Card Container */}
          <div
            style={{
              height: '98vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {/* Card */}
            <div
              dir={locale == 'ar' ? 'rtl' : 'ltr'}
              style={{
                width: '100%',
                background: 'rgb(28 52 91 / 36%)',
                color: 'white',
                padding: '10px',
                borderRadius: '15px',
                boxShadow: '0px 11px 1px rgba(0,0,0,0.05',
              }}
            >
              {/* Content */}
              <div>
                {/* City & Time */}
                <div
                  style={{ display: 'flex', alignItems: 'end', justifyContent: 'start' }}
                  dir={locale == 'ar' ? 'rtl' : 'ltr'}
                >
                  <Typography variant="h2" style={{ marginRight: '20px' }}>
                    {t('cairo')}
                  </Typography>
                  <Typography variant="h5" style={{ marginRight: '20px' }}>
                    {dateAndTime}
                  </Typography>
                </div>
                {/* === City & Time === */}

                <hr />

                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {/* Degree & Description  */}
                  <div>
                    {/* Temp */}
                    <div
                      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Typography variant="h1" style={{ textAlign: 'right' }}>
                        {temp.number}
                      </Typography>

                      {/* Temp Img */}
                      <img src={temp.icon} />
                    </div>
                    {/* === Temp === */}

                    <Typography variant="h6">{t(temp.description)}</Typography>

                    {/*  Min & Max */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <h5>
                        {t('min')}: {temp.min}
                      </h5>
                      <h5 style={{ margin: '0px 5px' }}>|</h5>
                      <h5>
                        {t('max')}: {temp.max}
                      </h5>
                    </div>
                  </div>
                  {/* === Degree & Description === */}

                  <CloudIcon style={{ fontSize: '200px' }} />
                </div>
              </div>
              {/* === Content === */}
            </div>
            {/* === Card === */}

            {/* Translation */}

            <div
              dir={locale == 'ar' ? 'rtl' : 'ltr'}
              style={{ width: '100%', display: 'flex', justifyContent: 'end', marginTop: '20px' }}
            >
              <Button style={{ color: 'white' }} variant="text" onClick={handleLangClick}>
                {locale == 'en' ? 'arabic' : 'انجليزي'}
              </Button>
            </div>
            {/* === Translation === */}
          </div>
          {/* === Card Container === */}
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
