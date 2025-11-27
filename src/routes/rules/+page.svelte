<main>
  <div class="container">
    <header>
      <h1 id="title">SELECT MURDER; Game Rules</h1>

      <p>My Digital School Lyon</p>
      <p>Johan Janin, Nikola Saubin, Anisse Yousfi, Marion Vieillard</p>
      <p>3-6+ players / 15-30 minutes</p>
    </header>
    <section aria-labelledby="overview">
      <h2 id="overview">1. Game Overview</h2>
      <p>Improve your knowledge of relational databases while having fun!</p>
      <p class="highlight">
        A murder has been committed, and the truth is buried deep inside the data.<br />
        We need your analytical skills! Will you uncover the clues and identify the killer before the
        others?
      </p>
      <p>
        SELECT MURDER; is an investigation card game where players act as data detectives. Using <strong
          >SQL-like cards</strong
        >
        and a <strong>web application</strong> accessible on mobile, players query a database to gather
        clues and identify the murderer.
      </p>
    </section>

    <section aria-labelledby="components">
      <h2 id="components">2. Game Components</h2>

      <h3>Table Cards: select the tables you want to query</h3>

      <ul>
        <li>
          <strong>TABLE</strong> : selects the table on which the query is based. Every query MUST start
          with one TABLE card.
        </li>
        <li>
          <strong>JOIN &ltTABLE&gt</strong> — join the starting table with another table. If the join
          has no common key, the query is invalid. Related tables are shown on the TABLE cards.
        </li>
      </ul>

      <h3>Modifier Cards: specify the query to obtain the targeted data</h3>
      <ul>
        <li>
          <strong>WHERE</strong>: filter the results according to a condition on a specific column
          =&gt values "equal to", "not equal to", "greater than", "less than" a specified value
          (e.g. firstname="John", angle&gt=90)
        </li>
        <li>
          <strong>WHERE IN</strong>: filter the results according to a condition on a specific
          column : value included in a set of values (e.g. location IN("London", "Paris",
          "Atlanta"))
        </li>
        <li>
          <strong>WHERE BETWEEN</strong>: filter the results according to a condition on a specific
          column : value between two specified values (e.g. angle BETWEEN 50 AND 120)
        </li>
        <li>
          <strong>WHERE LIKE</strong>: filter the results checking text formatting on a specific
          column. Use _ to replace a single unknown character (e.g. "m_n" matches "man", "men",
          "mon") and % to replace any sequence of characters (e.g. "%ing" matches all words ending
          with "ing": "running", "eating", "coding").
        </li>
        <li>
          <strong>ORDER BY</strong>: sort the results according to the value of a column, in
          ascending or descending order.
        </li>
        <li>
          <strong>GROUP BY</strong> + aggregations (COUNT, SUM, AVG…) : group the results according
          to the same value in a column and use an aggregate function as described below.
          <ol>
            <li>AVG: calculate the average of some grouped values</li>
            <li>COUNT: count the number of some grouped values</li>
            <li>MAX: return the maximum of some grouped values</li>
            <li>MIN: return the minimum of some grouped values</li>
            <li>SUM: return the sum of some grouped values</li>
          </ol>
        </li>
        <li><strong>LIMIT</strong>: limit the number of rows returned</li>
      </ul>

      <h3>Special Cards</h3>
      <p>These cards appear in both packs (Table Pack and Modifier Pack).</p>
      <ul>
        <li>
          <strong>*</strong> (wildcard): replaces any Table card when drawn from the Table Pack, or any
          Modifier card when drawn from the Modifier Pack.
        </li>
        <li>
          <strong>DELETE FROM suspects</strong>: played alone to make an official accusation through
          the app.
        </li>
      </ul>

      <div class="note">
        <strong>Digital add-on:</strong> the game requires the SELECT MURDER; web application (accessible
        from a smartphone). Each physical card contains a QR code that is scanned by the app to construct
        and run queries.
      </div>
    </section>

    <section aria-labelledby="setup">
      <h2 id="setup">3. Setup</h2>
      <ol>
        <li>Shuffle TABLE and JOIN cards into the <strong>Table Pack</strong>.</li>
        <li>Shuffle Modifier cards into the <strong>Modifier Pack</strong>.</li>
        <li>Place an empty <strong>Trash Pack</strong> nearby.</li>
        <li>Each player draws <strong>4 random cards</strong>.</li>
        <li>Open the SELECT MURDER; web application on a mobile device (one device per table).</li>
        <li>
          Adjust settings if needed: scenario, maximum scanned cards (default: 6), clue display time
          (default: 45s), then start the game.
        </li>
      </ol>

      <p class="small">(If a pack runs out, refill it by shuffling the Trash Pack into it.)</p>
    </section>

    <section aria-labelledby="gameplay">
      <h2 id="gameplay">4. Gameplay</h2>

      <p>
        The game is turn-based and proceeds clockwise. The player who most recently conducted an
        investigation in their professional or personal life starts (and must tell the anecdote!).
      </p>
      <p>On their turn, a player must choose <strong>one</strong> of two actions:</p>

      <h3>A. Draw a card</h3>
      <p>Draw one card from either the Table Pack or the Modifier Pack. Add it to your hand.</p>

      <h3>B. Build a query (up to 6 cards)</h3>
      <p>
        Assemble up to six cards from your hand to form a SQL-style query and scan the cards one by
        one in the app. (e.g. "TABLE SUSPECTS" + "JOIN CRIME SCENES" + "WHERE" + "WHERE LIKE" +
        "ORDER BY")
      </p>

      <div class="note">
        <h3>Rules for building a query</h3>
        <ul>
          <li>Every query <strong>must start</strong> with a TABLE card.</li>
          <li>You may add JOINs, Modifiers, and the wildcard (*).</li>
          <li>Maximum <strong>6 cards</strong> per query.</li>
          <li>
            If a JOIN is invalid (no common key), the query is invalid and the player loses their
            turn; used cards return to the Trash Pack.
          </li>
        </ul>
        <p>
          e.g. "TABLE SUSPECTS" + "JOIN CRIME SCENES" + "*" + "WHERE" + "WHERE LIKE" + "ORDER BY"
        </p>
      </div>
      <div class="note">
        <h3>When you scan</h3>
        <ul>
          <li>Scan cards in the order you assembled them.</li>
          <li>Fill inputs in the app if needed.</li>
          <li>
            The web app validates the query, runs it on the scenario database, and displays the
            result/clue for the configured time. Remember to write down the clues you collect for
            later in the game!
          </li>
          <li>All scanned cards are moved to the Trash Pack after the query completes.</li>
        </ul>
      </div>

      <p class="muted">
        Important: if the app detects an invalid combination (syntax or incompatible join), it shows
        an error and the player’s turn ends.
      </p>
    </section>

    <section aria-labelledby="accuse">
      <h2 id="accuse">5. Accusing the Murderer</h2>

      <p>
        To make a formal accusation, a player must play the <strong>DELETE FROM suspects</strong> card
        alone. The app will then ask that player to select the suspect they want to remove (their guess
        for the murderer).
      </p>

      <h3>Outcomes</h3>
      <ul>
        <li><strong>If correct:</strong> The player wins the game immediately.</li>
        <li>
          <strong>If incorrect — first time:</strong> The player receives an "under surveillance" badge
          and must replace one of their cards with the top card from the Trash Pack.
        </li>
        <li>
          <strong>If incorrect — second time:</strong> The player is eliminated from the game. Their
          remaining cards are returned to the Trash Packs.
        </li>
      </ul>
    </section>

    <section aria-labelledby="win">
      <h2 id="win">6. Victory</h2>
      <p>
        The first player to correctly identify the murderer (via the app after playing <strong
          >DELETE FROM suspects</strong
        >) wins the game.
      </p>
    </section>

    <section aria-labelledby="qr">
      <h2 id="qr">7. QR Codes & Using the Web App</h2>

      <p class="note">
        <strong>How it works:</strong> every physical card has a unique QR code. When a player builds
        a query they scan each card's QR code in the app to rebuild the query. The app verifies the sequence
        and executes the equivalent database query on the scenario dataset.
      </p>

      <h3>Step-by-step scanning flow</h3>
      <ol>
        <li>
          Open the SELECT MURDER; web app on the provided mobile device and enter the current game
          session.
        </li>
        <li>Tap <em>"Construct your query"</em></li>
        <li>The app asks for the first card's QR code (must be a TABLE card). Scan it.</li>
        <li>
          Scan additional cards in order. Use <em>Add card</em> or <em>Validate</em> to finish scanning.
        </li>
        <li>
          Press <em>Validate the query</em>; the app runs the query and displays the result for the
          configured time.
        </li>
      </ol>

      <h3>If a QR code cannot be read</h3>
      <ul>
        <li>Try cleaning the camera lens and move slightly farther/closer.</li>
        <li>Use the phone’s autofocus by tapping the screen on the QR code area.</li>
        <li>
          If still unreadable, the app offers a manual ID input field (enter the card code printed
          under the QR code) or lets you replace the card if it is damaged.
        </li>
      </ul>

      <h3>Device requirements & tips</h3>
      <ul>
        <li>A modern smartphone with camera and a web browser (Chrome / Safari recommended).</li>
        <li>Internet connection required (app is hosted online).</li>
        <li>One device per table — players pass the device when scanning during their turn.</li>
      </ul>
    </section>

    <section aria-labelledby="pedago">
      <h2 id="pedago">8. Educational Objectives & Prerequisites</h2>

      <p>
        <strong>Learning goals:</strong> after playing SELECT MURDER;, players should be able to:
      </p>
      <ul>
        <li>Identify main SQL clauses: JOIN, WHERE, ORDER BY, GROUP BY, LIMIT.</li>
        <li>Understand relationships between tables and the effect of filters.</li>
        <li>Use aggregations and sorting to extract meaningful information.</li>
        <li>Construct queries step by step and apply logical reasoning to an investigation.</li>
      </ul>

      <p>
        <strong>Prerequisites:</strong> a basic idea of what a relational database is (tables, rows,
        columns) and a brief introduction to SELECT queries is helpful. A short 2–3 minute primer is
        usually sufficient for beginners.
      </p>
    </section>

    <section aria-labelledby="faq">
      <h2 id="faq">9. Quick Reference</h2>

      <table aria-describedby="turn-summary">
        <thead>
          <tr><th>Action</th><th>Effect</th></tr>
        </thead>
        <tbody>
          <tr><td>Draw a card</td><td>Take one card from the Table Pack or Modifier Pack.</td></tr>
          <tr
            ><td>Build a query</td><td
              >Scan up to 6 cards, run the query in the web app, get a clue; used cards → Trash
              Pack.</td
            ></tr
          >
          <tr
            ><td>DELETE FROM suspects</td><td
              >Make an accusation via the app — immediate win if correct; penalties if wrong.</td
            ></tr
          >
        </tbody>
      </table>
    </section>
  </div>
</main>

<style>
  /* ===== Variables de couleurs ===== */
  :root {
    --bg-dark: #090510ff; /* fond principal très sombre */
    --purple-light: #ada2e8ff; /* violet clair pour titres, hover, surbrillances */
    --text-main: #ebebf6ff; /* texte principal clair pour contraste */
    --text-muted: #c0bfe0; /* texte secondaire */
    --shadow-dark: rgba(0, 0, 0, 0.7);
    --shadow-light: rgba(149, 135, 222, 0.4);
    --note-bg: rgba(149, 135, 222, 0.1);
    --note-border: #9587de;
    --table-header-bg: #29144b;
    --table-row-bg: rgba(41, 20, 75, 0.4);
  }

  /* ===== Base ===== */
  main {
    font-family: monospace;
    background: var(--bg-dark);
    color: var(--text-main);
    margin: 0;
    padding: 0;
    line-height: 1.5;
    font-size: 1.2rem;
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* ===== Header ===== */
  header {
    text-align: center;
    padding: 2rem 1rem;
    background: rgba(41, 20, 75, 0.9);
    border-radius: 15px;
  }

  header h1 {
    font-size: 2.4rem;
    color: var(--purple-light);
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 5px var(--bg-dark);
  }

  header p {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: 0.2rem 0;
  }

  /* ===== Section Titles ===== */
  h2,
  h3 {
    color: var(--purple-light);
  }

  header p:last-child {
    margin-top: 1rem;
    font-size: 1.1rem;
  }

  h2 {
    font-size: 1.8rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.3rem;
    margin-top: 1.2rem;
    margin-bottom: 0.5rem;
  }

  /* ===== Highlight ===== */
  .highlight {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--purple-light);
    background: linear-gradient(135deg, rgba(149, 135, 222, 0.15), rgba(41, 20, 75, 0.25));
    padding: 1rem 1.2rem;
    border-left: 4px solid var(--purple-light);
    border-radius: 10px;
    margin: 1.2rem 0;
    box-shadow: 0 0 12px rgba(149, 135, 222, 0.25);
    line-height: 1.7;
  }

  /* ===== Lists ===== */
  ul,
  ol {
    margin-left: 1.5rem;
    padding-left: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  /* ===== Notes ===== */
  .note {
    background: var(--note-bg);
    border-left: 4px solid var(--note-border);
    padding: 0.8rem 1rem;
    margin: 1rem 0;
    border-radius: 10px;
  }

  /* ===== Tables ===== */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    background: rgba(41, 20, 75, 0.8);
    border-radius: 10px;
    overflow: hidden;
  }

  table th,
  table td {
    padding: 0.8rem 1rem;
    text-align: left;
  }

  table th {
    background: var(--table-header-bg);
    color: var(--text-main);
  }

  table tr:nth-child(even) td {
    background: var(--table-row-bg);
  }

  /* ===== Small / Muted text ===== */
  p.small,
  p.muted {
    font-size: 0.85rem;
    color: var(--text-muted);
  }
</style>
