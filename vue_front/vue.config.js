// webpack.config.js파일 위치 : node_modeuls\@vue\cli-service\webpack.config.js
module.exports = {
  configureWebpack: {
    // 웹팩 추가 설정하는 부분, https://vuedal.tistory.com/2
    // + 웹팩 설정 확인하는 법(inspect명령어) : https://vuedal.tistory.com/3?category=741984
    // 추가참고 : https://lovemewithoutall.github.io/it/vue-cli-3-webpack/
    // 추가참고2 :https://psawesome.tistory.com/24
		// webpack 개념(TOAST UI) : https://ui.toast.com/fe-guide/ko_BUNDLER
		// webpack의 cache-loader : https://velog.io/@moggy/Webpack-%EC%9D%98-cache-loader-
    plugins: [],
	},

  transpileDependencies: [//vuetify 설치해서 추가된 부분.
    'vuetify'
  ]
}

//그때 적용하다 실패한부분 링크 : https://velog.io/@moggy/Vue.js-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%97%90-ESLint-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0
/*
module.exports = {
  chainWebpack: (config) => {
    config.module.rule('eslint').use('eslint-loader')
      .tap((options) => {
        options.fix = true; // auto-fix 옵션
        return options;
      });
  },
};
*/
