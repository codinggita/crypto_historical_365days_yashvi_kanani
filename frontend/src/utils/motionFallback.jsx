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

const cache = {};

const createMotionComponent = (tag) =>
  React.forwardRef((props, ref) => {
    const Tag = tag;
    return <Tag {...filterProps(props)} ref={ref} />;
  });

export const motion = new Proxy(
  {},
  {
    get: (_, tag) => {
      if (!cache[tag]) cache[tag] = createMotionComponent(tag);
      return cache[tag];
    },
  }
);

export const AnimatePresence = ({ children }) => <>{children}</>;
