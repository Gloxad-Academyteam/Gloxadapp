import { Avatar } from "./Avatar"

function DemoAvatar(){
    return (
        <div>
        <Avatar imageSrc="https://xsgames.co/randomusers/avatar.php?g=female" altText="A lady's picture" isBig={true}/>
        <Avatar imageSrc="https://xsgames.co/randomusers/avatar.php?g=female" altText="A lady's picture" isBig={false}/>
        </div>
    )
}
export default DemoAvatar