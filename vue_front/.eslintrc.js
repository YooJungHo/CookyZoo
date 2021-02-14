//참고링크 : https://velog.io/@velopert/eslint-and-prettier-in-react
// extends의 plugin:vue/base는 왜? : https://medium.com/@changjoopark/vue-js-%EA%B3%B5%EC%8B%9D-eslint-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0-3457ac648b05
//추후 eslint git commit시 강제하기 설정 적용. https://www.daleseo.com/js-eslint/  
//슈크림 네이버블로그 : https://m.blog.naver.com/PostView.nhn?blogId=qls0147&logNo=222049158711&proxyReferer=https:%2F%2Fwww.google.com%2F
//eslint 기본 설명: https://velog.io/@kyusung/eslint-config-2
// 기본설명 2 : https://velog.io/@velopert/eslint-and-prettier-in-react
//동작방식 : https://tech.kakao.com/2019/12/05/make-better-use-of-eslint/


//참고 가이드 : https://github.com/naver/eslint-config-naver/blob/master/STYLE_GUIDE.md
module.exports = {
  root: true,
  env: {
    node: true
  },
	//extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
	// eslint-plugin-prettier(설치됨) : 프리티어 포맷팅 규칙을 eslint로 추가하고, 중복되는 옵션이 있으면 프리티어 규칙을 사용하도록 함.
  extends: ["plugin:vue/base", "prettier", "naver"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    // "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    // "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
		"max-len" : "off",
    "object-curly-spacing": "off", //0208 변경 회의때 말해야함(공유해야함)
    "arrow-parens": "off", // 0210 제거 회의때 말해야 함
    "comma-dangle": "off" // 0210 제거 회의때 말해야 함
  }
};
