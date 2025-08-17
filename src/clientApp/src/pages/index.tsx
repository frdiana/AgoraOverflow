import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title({ color: "violet" })}>
            AgoraOverflow&nbsp;
          </span>
          <br />
          <div className={subtitle({ class: "mt-3" })}>
            Too many agents. Too many opinions. Just right.
          </div>
        </div>

        <div className="flex gap-3" />
      </section>
    </DefaultLayout>
  );
}
