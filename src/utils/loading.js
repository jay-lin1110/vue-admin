import { Loading } from 'element-ui'

const options = {
  lock: true,
  text: '拼命加载中！QAQ',
  background: 'rgba(0, 0, 0, .7)'
}

const LoadingService = {
  start: () => Loading.service(options),

  end() {
    this.start().close()
  }
}

export default LoadingService
