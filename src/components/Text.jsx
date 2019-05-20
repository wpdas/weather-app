import React from 'react';
import PropTypes from 'prop-types';

const titleTextStyle = {
  textAlign: 'center',
  marginTop: '80px',
  textTransform: 'uppercase',
  color: '#FFF',
  fontWeight: 'bold',
  textShadow: 'rgba(0, 0, 0, 0.5) 1px 1px 3px'
};

const capitalTextStyle = {
  textAlign: 'center',
  margin: '68px 0 0 0',
  textTransform: 'uppercase',
  color: '#FFF',
  fontWeight: 'bold',
  letterSpacing: '4px',
  textShadow: 'rgba(0, 0, 0, 1) 1px 1px 3px'
};

const degreesTextStyle = {
  textAlign: 'center',
  color: '#FFF',
  fontWeight: 'bold',
  letterSpacing: '4px',
  fontSize: '94px',
  margin: 0,
  textShadow: 'rgba(0, 0, 0, 0.5) 1px 1px 3px'
};

const descriptionTextStyle = {
  textAlign: 'center',
  color: '#FFF',
  marginTop: '8px',
  letterSpacing: '-0.4px',
  textShadow: 'rgba(0, 0, 0, 0.6) 1px 1px 3px'
};

const Title = ({ children }) => {
  return <h1 style={titleTextStyle}>{children}</h1>;
};

const CapitalText = ({ children }) => {
  return <h4 style={capitalTextStyle}>{children}</h4>;
};

const DegreesText = ({ children }) => {
  return <p style={degreesTextStyle}>{children}</p>;
};

const DescriptionText = ({ children, style }) => {
  const currentStyle = {
    ...descriptionTextStyle,
    ...style
  };
  return <h5 style={currentStyle}>{children}</h5>;
};

const Text = {
  Title,
  CapitalText,
  DegreesText,
  DescriptionText
};

Title.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

CapitalText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

DegreesText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

DescriptionText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  style: PropTypes.object
};
DescriptionText.defaultProps = {
  style: {}
};

export default Text;
