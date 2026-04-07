type UserProfileProps = {
  image: string;
};

export default function UserProfile(props: UserProfileProps) {
  return (
    <div class="h-[50px] w-[50px]">
      <img
        src={props.image}
        alt="profile"
        class="h-[50px] w-[50px] object-cover rounded-full border border-[var(--color-border-1)] "
      />
    </div>
  );
}