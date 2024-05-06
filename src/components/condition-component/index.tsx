const ConditionComponent: React.FC<{
  condition: any;
  children: React.ReactElement;
}> = ({ condition, children }) => {
  if (!!condition) {
    return children;
  }

  return null;
};

export default ConditionComponent;
