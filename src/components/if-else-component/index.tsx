const IfElseComponent: React.FC<{
  condition: any;
  if: React.ReactNode;
  else: React.ReactNode;
}> = (props) => {
  if (!!props.condition) {
    return <>{props.if}</>;
  } else {
    return <>{props.else}</>;
  }
};

export default IfElseComponent;
