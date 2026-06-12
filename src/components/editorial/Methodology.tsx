export function Methodology() {
  return (
    <section className="methodology-section" aria-labelledby="methodology-title">
      <div style={{ maxWidth: 960 }}>
        <div style={{ borderBottom: "1px solid var(--hairline)", paddingBottom: 16, marginBottom: 24 }}>
          <h2 id="methodology-title">方法论与编辑标准</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "4px 0 0" }}>
            数据来源、映射算法、金融披露和地缘政治边界的说明文档。
          </p>
        </div>

        <div className="methodology-grid">
          {/* 左栏 */}
          <div>
            <div className="methodology-block">
              <h3>1. 数据来源与范围</h3>
              <p>
                本项目整合三个主要数据层，描绘支撑 NVIDIA AI 硬件的物理与金融生态系统：
              </p>
              <ul>
                <li>
                  <strong>Scrutica 供应链数据</strong>：由行业公开信息、货运记录和监管文件汇编而成（截至 2026 年 6 月）。该数据库追踪企业间的技术供应关系。
                </li>
                <li>
                  <strong>全球训练设施数据库</strong>：追踪大规模 AI 集群和超大规模数据中心，数据来源包括 epoch-gpu-clusters 和公开新闻报道。
                </li>
                <li>
                  <strong>金融历史数据（NVIDIA CSV）</strong>：整合季度财报日历、EPS 意外指标和复权日价，来源于 Alpha Vantage 和 Yahoo Finance。
                </li>
              </ul>
            </div>

            <div className="methodology-block">
              <h3>2. 关系方向与术语</h3>
              <p>
                关系按技术流向定义：<strong>供应商 → 客户</strong>。
              </p>
              <ul>
                <li>
                  <strong>上游</strong>：以 <code style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>customer=NVIDIA</code> 标识。代表向 NVIDIA 供应组件的企业（如台积电、SK 海力士）。
                </li>
                <li>
                  <strong>下游需求</strong>：以 <code style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>supplier=NVIDIA</code> 标识。代表采购硬件的超大规模云服务商或实验室，不是供应商。
                </li>
                <li>
                  <strong>二层候选路径</strong>：如 <code style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>ASML → TSMC</code> 等路径标注为候选二层关系。代表向 NVIDIA 直接制造商供应关键设备或材料的企业，不是 NVIDIA 的直接供应商。
                </li>
              </ul>
            </div>
          </div>

          {/* 右栏 */}
          <div>
            <div className="methodology-block">
              <h3>3. 指标定义与局限</h3>
              <p>
                指标用于风险评估，不应解读为金融交易数据：
              </p>
              <ul>
                <li>
                  <strong>关键性（criticality）</strong>：1-10 分的风险重要性评分，评估替换一个供应商节点的难度。这是风险指数，不是合同金额或订单量。
                </li>
                <li>
                  <strong>占比（share_pct）</strong>：代表来自可用公开文件的局部样本占比，不是完整的全球市场份额。
                </li>
                <li>
                  <strong>单一来源（is_sole_source）</strong>：布尔标记，表示数据库中该特定组件或阶段目前没有替代供应商注册记录。
                </li>
              </ul>
            </div>

            <div className="methodology-block">
              <h3>4. 地图与可视化规则</h3>
              <p>
                地理渲染遵循严格的编辑和制图规则：
              </p>
              <ul>
                <li>
                  <strong>弧线是关系，不是路线</strong>：SVG 弧线连接供应商国家和客户国家，表示技术依赖关系。不代表实际运输路径、空运航线或物流通道。
                </li>
                <li>
                  <strong>设施地图不是客户名单</strong>：全球设施标记展示数据中心容量（MW），说明地理需求集中度。不是完整的客户名单。
                </li>
                <li>
                  <strong>股价时间线是背景，不是因果</strong>：NVIDIA 股价和盈利意外的绘制仅提供一般金融背景。不意味着特定的供应链披露直接导致了股价变动。
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 脚注 */}
        <div className="methodology-footnotes">
          <h3>5. 边界惯例与数据完整性</h3>
          <p>
            为准确反映电子产品贸易中不同的监管、关税和物流结构，台湾（TW）、中国大陆（CN）和香港（HK）在所有表格、汇总和地图筛选中均作为独立实体列出。
            世界地图投影已过滤南极洲，以保留画布空间用于高密度供应链路线。
          </p>
          <p style={{ marginTop: 12 }}>
            注：项目启动时确认 <code style={{ fontFamily: "IBM Plex Mono, monospace" }}>scrutica-data-dictionary.md</code> 文件缺失，已记录在案。
            国际新闻机构（Bloomberg、Reuters、FT、WSJ）的参考资料仅用于分析视觉结构和信息架构，未复制任何代码、布局或资源。
          </p>
        </div>
      </div>
    </section>
  );
}
