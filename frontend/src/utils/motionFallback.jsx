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
    layout,
    viewport,
    onAnimationComplete,
    ...clean
  } = props;
  return clean;
};

// Using a Proxy to dynamically support any element (motion.div, motion.tr, motion.p, etc.)
export const motion = new Proxy({}, {
  get(target, tag) {
    if (typeof tag !== 'string') return undefined;
    if (!(tag in target)) {
      target[tag] = React.forwardRef((props, ref) => {
        const Element = tag;
        return <Element {...filterProps(props)} ref={ref} />;
      });
    }
    return target[tag];
  }
});

export const AnimatePresence = ({ children }) => <>{children}</>;
export default motion;
