module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/blaze",
        destination: "https://blaze.com/api/crash_games/history",
      },
    ];
  };
  return {
    rewrites,
  };
};
