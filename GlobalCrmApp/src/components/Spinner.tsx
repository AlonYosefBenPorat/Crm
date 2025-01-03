import React from 'react';
import { Blocks, Grid } from 'react-loader-spinner';

const Spinner = (props) => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <p>{props.title ?? "Loading please wait"}</p>
        <Grid color="#4A90E2" height={20} wrapperClass='flex justify-center items-center' />
      </div>
    </div>
  );
}

export const LoadingSpinner = (props) => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <Blocks color="#4fa94d" height={80} wrapperClass='flex justify-center items-center' />
        <p className="text-center">{props.title ?? "Loading"}</p>
      </div>
    </div>
  );
}
export default Spinner;