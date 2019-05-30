import React from 'react';
import PropTypes from 'prop-types';
import { connect, updateState } from 'rehoc';
import classes from './WeatherApp.module.scss';
import api from './api';
import isRetina from './utils/isRetina';
import isHighDensity from './utils/isHighDensity';
import defaultWeatherProps from './states/weather/state';

import { Container, Row, Col } from 'shards-react';
import Select from './components/Select';
import Text from './components/Text';

// State key name
const weatherState = 'weatherState';

class WeatherApp extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handlerOnSelectCountry = this.handlerOnSelectCountry.bind(this);
    this.handlerOnSelectState = this.handlerOnSelectState.bind(this);
  }

  async componentDidMount() {
    const countriesResult = await api.getCountries();
    updateState(weatherState, { countries: countriesResult.data });
  }

  async handlerOnSelectCountry(event) {
    const countryCode = event.target.value;

    updateState(weatherState, {
      waitingText: 'Loading...'
    });

    const statesResult = await api.getStateByCode(countryCode);

    if (statesResult.status === 200) {
      let waitingTextMessage = 'Choose a State / Sub-division above';
      if (!statesResult.data.RestResponse.result.length) {
        waitingTextMessage = "Sorry, we couldn't find data to this Country";
      }

      updateState(weatherState, {
        states: statesResult.data.RestResponse.result,
        selectedCountryCode: countryCode,
        waitingText: waitingTextMessage
      });
    } else {
      updateState(weatherState, {
        waitingText: "Sorry, we couldn't find data to this Country"
      });
    }
  }

  async handlerOnSelectState(event) {
    const { selectedCountryCode } = this.props;
    const selectedCapital = event.target.value;

    updateState(weatherState, {
      waitingText: 'Loading...'
    });

    let weatherDataResult;

    try {
      weatherDataResult = await api.getWeatherByCityAndCode(
        selectedCapital,
        selectedCountryCode
      );
    } catch (err) {
      weatherDataResult = null;
    }

    if (weatherDataResult) {
      updateState(weatherState, {
        backgroundImages: weatherDataResult.data.images,
        description: weatherDataResult.data.weather[0].description,
        degrees: weatherDataResult.data.main.temp.toFixed(),
        selectedCapital: selectedCapital,
        waitingText: ''
      });
    } else {
      updateState(weatherState, {
        waitingText: 'Sorry, this State / Sub-division was not found!'
      });

      setTimeout(() => {
        updateState(weatherState, {
          waitingText: ''
        });
      }, 7000);
    }
  }

  render() {
    const {
      countries,
      states,
      selectedCapital,
      backgroundImages,
      description,
      waitingText,
      degrees
    } = this.props;

    // Load countries list
    const countriesList = countries.map(item => {
      return (
        <option key={item.numericCode} value={item.alpha3Code}>
          {item.name}
        </option>
      );
    });
    countriesList.unshift(
      <option key="initial" value="">
        Choose a Country
      </option>
    );

    // Load states list
    const statesList = states.map(item => {
      return (
        <option key={item.id} value={item.capital}>
          {item.name}
        </option>
      );
    });

    if (statesList && statesList.length) {
      statesList.unshift(
        <option key="initial" value="">
          Choose a State / Sub-division
        </option>
      );
    }

    // Set background based on local
    let backgroundStyle = {};
    if (
      backgroundImages &&
      backgroundImages.large &&
      backgroundImages.large2x
    ) {
      if (isRetina() || isHighDensity()) {
        backgroundStyle = {
          backgroundImage: `url('${backgroundImages.large2x}')`
        };
      } else {
        backgroundStyle = {
          backgroundImage: `url('${backgroundImages.large}')`
        };
      }
    }

    return (
      <div className={classes.WeatherApp} style={backgroundStyle}>
        <Container>
          <Row>
            <Col sm={{ size: 8, order: 2, offset: 2 }}>
              <Text.Title>Capital Weather</Text.Title>

              <Select onChange={this.handlerOnSelectCountry}>
                {countriesList ? (
                  countriesList
                ) : (
                  <option value="first">Loading...</option>
                )}
              </Select>

              {statesList.length ? (
                <Select onChange={this.handlerOnSelectState}>
                  {statesList}
                </Select>
              ) : null}

              {selectedCapital ? (
                <React.Fragment>
                  <Text.CapitalText>{selectedCapital}</Text.CapitalText>
                  <Text.DegreesText>{degrees}°</Text.DegreesText>
                  <Text.DescriptionText>
                    Expect to see {description}
                  </Text.DescriptionText>
                </React.Fragment>
              ) : null}

              <Text.DescriptionText style={{ marginTop: '32px' }}>
                {waitingText}
              </Text.DescriptionText>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

WeatherApp.propTypes = {
  countries: PropTypes.array,
  states: PropTypes.array,
  selectedCountryCode: PropTypes.string,
  selectedCapital: PropTypes.string,
  backgroundImages: PropTypes.object,
  description: PropTypes.string,
  waitingText: PropTypes.string,
  degrees: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
WeatherApp.defaultProps = {
  ...defaultWeatherProps
};

export default connect(
  WeatherApp,
  weatherState
);
