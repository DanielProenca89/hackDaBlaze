module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/blaze",
        destination: "https://de.hideproxy.me/includes/process.php?action=update"
      },
    ];
  };
  return {
    rewrites,
  };
};
