fetch('https://www.panda.gg/products', {method: 'HEAD'}).then((res) => console.log(res.status)).catch(() => console.log('error'));
