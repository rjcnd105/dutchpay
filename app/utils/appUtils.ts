import { toast } from 'react-toastify';

type ShareProps = {
  title: string;
  url: string;
};

export const share = (props: ShareProps) => {
  if (navigator.share) {
    navigator.share(props);
  } else {
    navigator.clipboard.writeText(props.url).then(
      () => {
        toast('URL이 복사되었습니다.', { type: 'success' });
      },
      () => {
        toast('클립보드 복사 권한을 허용해주세요.', { type: 'error' });
      },
    );
  }
};
