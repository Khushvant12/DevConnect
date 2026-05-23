import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';

export default function SearchBar({ values, onChange, onSearch, loading }) {
  const handle = (e) => onChange({ ...values, [e.target.name]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      className="space-y-3"
    >
      <Input
        label="Search projects"
        name="q"
        value={values.q}
        onChange={handle}
        placeholder="Title or description..."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Technology"
          name="tech"
          value={values.tech}
          onChange={handle}
          placeholder="react, node"
        />
        <Input
          label="Developer"
          name="developer"
          value={values.developer}
          onChange={handle}
          placeholder="username or name"
        />
      </div>
      <Button type="submit" loading={loading} className="w-full sm:w-auto">
        Search
      </Button>
    </form>
  );
}
