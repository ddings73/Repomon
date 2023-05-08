import React from "react";
import styles from "./DetailContribution.module.scss";
import { ContributionChart } from "./ContributionChart";
import { RepoDetailContributionInfoType } from "@/types/repoDetail";

function DetailContribution({
  contributionInfo,
}: {
  contributionInfo: RepoDetailContributionInfoType;
}) {
  const commitDesc = Object.values(contributionInfo.committers).sort(function (
    a,
    b
  ) {
    return b - a;
  });
  const newCommitters = [];

  for (let i = 0; i < commitDesc.length; i++) {
    console.log(commitDesc[i]);
    for (let commiter in contributionInfo.committers) {
      if (contributionInfo.committers[commiter] === commitDesc[i]) {
        newCommitters.push({
          rank: i + 1,
          id: commiter,
          commitCnt: commitDesc[i],
        });
      }
    }
  }

  return (
    <div>
      <p className={styles["tab-title"]}>레포지토리 기여도 정보</p>
      <p className={styles["tab-des"]}>
        나와 팀원들의 커밋 수를 확인할 수 있어요.
      </p>
      <div style={{ display: "flex", marginTop: "4rem" }}>
        <div className={styles.left}>
          <ContributionChart commiters={contributionInfo.committers} />
        </div>
        <div className={styles.right}>
          <div className={styles["title-line"]}>
            <span>순위</span>
            <span>Git ID</span>
            <span>커밋 수</span>
          </div>
          {newCommitters.map((data, index) => (
            <div
              key={index}
              className={
                data.rank === 1
                  ? `${styles["item-line"]} ${styles.top}`
                  : styles["item-line"]
              }
            >
              <span>{data.rank}</span>
              <span>{data.id}</span>
              <span>{data.commitCnt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailContribution;