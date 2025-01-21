import React from 'react';
import sprite from '../../assets/icons/icons.svg';

const Icon = ({ name, className }) => {
  return (
    <svg className={className}>
      <use href={`${sprite}#${name}`} />
    </svg>
  );
};

export default Icon;
