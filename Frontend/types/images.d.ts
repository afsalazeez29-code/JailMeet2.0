declare module '*.PNG' {
  const image: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };

  export default image;
}
