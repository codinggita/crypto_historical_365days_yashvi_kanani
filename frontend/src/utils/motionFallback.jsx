import React from 'react';

const filterProps = (props) => {
  const {
    layoutId,
    initial,
    animate,
    exit,
    variants,
    transition,
    whileHover,
    whileTap,
    ...clean
  } = props;
  return clean;
};

export const motion = {
  div: React.forwardRef((props, ref) => <div {...filterProps(props)} ref={ref} />),
  button: React.forwardRef((props, ref) => <button {...filterProps(props)} ref={ref} />),
  span: React.forwardRef((props, ref) => <span {...filterProps(props)} ref={ref} />),
  h1: React.forwardRef((props, ref) => <h1 {...filterProps(props)} ref={ref} />),
  h2: React.forwardRef((props, ref) => <h2 {...filterProps(props)} ref={ref} />),
  li: React.forwardRef((props, ref) => <li {...filterProps(props)} ref={ref} />),
};

export const AnimatePresence = ({ children }) => <>{children}</>;
