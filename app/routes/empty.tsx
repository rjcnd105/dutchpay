import Button from '~/components/ui/Button';
import pathGenerator from '~/service/pathGenerator';

const empty = () => {
  return (
    <div>
      <p>주소에 해당하는 방이 없습니다!</p>
      <p>방을 다시 만들어주세요.</p>
      <div>
        <Button theme="solid/blue" onClick={() => pathGenerator.rending()}>
          만들러 가기
        </Button>
      </div>
    </div>
  );
};
export default empty;
