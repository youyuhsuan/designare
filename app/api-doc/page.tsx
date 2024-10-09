import { getApiDocs } from "@/src/libs/swagger";
import ReactSwagger from "@/src/components/ReactSwagger";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
