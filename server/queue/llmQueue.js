const queue = [];
let processing = false;

export const addToQueue = (task) => {
  return new Promise((resolve, reject) => {
    queue.push({ task, resolve, reject });
    processQueue();
  });
};

const processQueue = async () => {
  if (processing || queue.length === 0) return;

  processing = true;
  const { task, resolve, reject } = queue.shift();

  try {
    const result = await task();
    resolve(result);
  } catch (err) {
    reject(err);
  } finally {
    processing = false;
    processQueue();
  }
};
