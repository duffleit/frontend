import React from "react";

jest.genMockFromModule('react-intl');

const mockMessage = (props) => (<span>{props.defaultMessage}</span>);
const mockNumber = (props) => (<span>{`${props.value} ${props.currency}`}</span>);

exports.FormattedNumber = mockNumber;
exports.FormattedMessage = mockMessage;
