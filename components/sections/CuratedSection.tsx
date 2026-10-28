import Image from "next/image";

export type TeamCard = {
  _id: string;
  name: string | null;
  role: string | null;
  bio: string | null;
  photoUrl: string | null;
};

export const CuratedSection = ({ heading, team }: { heading?: string | null; team: TeamCard[] }) => (
  <section id="curated">
    <h2>{heading}</h2>
    <div className="cards-row">
      {team.map((member) => (
        <div key={member._id} className="card">
          <div className="card-img">
            {member.photoUrl && (
              <Image
                src={member.photoUrl}
                alt={member.name ?? ""}
                width={660}
                height={885}
                sizes="(max-width: 768px) 340px, 280px"
              />
            )}
          </div>
          <div className="card-body">
            <span className="card-role">{member.role}</span>
            <h3>{member.name}</h3>
            <p>{member.bio}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
