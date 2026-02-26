interface UsernameBadgeProps {
  username: string;
  date?: Date;
}

export default function UsernameBadge({ username, date }: UsernameBadgeProps) {
  return (
    <h5 className="d-flex align-items-center gap-3">
      <span className='badge text-bg-secondary'>
        {username}
      </span>
      {date && (
        <span className="text-muted small">
          {date.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </span>
      )}
    </h5>
  );
}