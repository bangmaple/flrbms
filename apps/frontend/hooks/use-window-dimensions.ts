export function useWindowDimensions() {
  if (typeof window !== "undefined") {
    const {innerWidth: width, innerHeight: height} = window;
    return {
      width,
      height
    };
  }

  return {
    width: 0,
    height: 0
  }

}
