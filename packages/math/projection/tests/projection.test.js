import { Projection } from '..';

describe('math/projection', () => {
  const CLOSE = 6; // digits

  describe('constructor', () => {
    it('creates a default Projection', () => {
      const proj = new Projection();
      const t = proj.transform();
      expect(t.x).toBe(0);
      expect(t.y).toBe(0);
      expect(t.k).toBe(256 / Math.PI); // z1
    });

    it('creates a Projection with parameters', () => {
      const proj = new Projection(20, 30, 512 / Math.PI);
      const t = proj.transform();
      expect(t.x).toBe(20);
      expect(t.y).toBe(30);
      expect(t.k).toBe(512 / Math.PI); // z2
    });
  });

  describe('#project', () => {
    it('Projects [0, 0] -> [0, 0]', () => {
      const proj = new Projection();
      const p = proj.project([0, 0]);
      expect(p[0]).toBeCloseTo(0, CLOSE);
      expect(p[1]).toBeCloseTo(0, CLOSE);
    });

    it('Projects [180, -85.0511287798] -> [256, 256] (at z1)', () => {
      const proj = new Projection();
      const p = proj.project([180, -85.0511287798]);
      expect(p[0]).toBeCloseTo(256, CLOSE);
      expect(p[1]).toBeCloseTo(256, CLOSE);
    });

    it('Projects [-180, 85.0511287798] -> [-256, -256] (at z1)', () => {
      const proj = new Projection();
      const p = proj.project([-180, 85.0511287798]);
      expect(p[0]).toBeCloseTo(-256, CLOSE);
      expect(p[1]).toBeCloseTo(-256, CLOSE);
    });

    it('Projects [180, -85.0511287798] -> [512, 512] (at z2)', () => {
      const proj = new Projection(0, 0, 512 / Math.PI);
      const p = proj.project([180, -85.0511287798]);
      expect(p[0]).toBeCloseTo(512, CLOSE);
      expect(p[1]).toBeCloseTo(512, CLOSE);
    });

    it('Projects [-180, 85.0511287798] -> [-512, -512] (at z2)', () => {
      const proj = new Projection(0, 0, 512 / Math.PI);
      const p = proj.project([-180, 85.0511287798]);
      expect(p[0]).toBeCloseTo(-512, CLOSE);
      expect(p[1]).toBeCloseTo(-512, CLOSE);
    });

    it('Applies translation when projecting', () => {
      const proj = new Projection(20, 30);
      const p = proj.project([-180, 85.0511287798]);
      expect(p[0]).toBeCloseTo(-236, CLOSE);
      expect(p[1]).toBeCloseTo(-226, CLOSE);
    });
  });

  describe('#invert', () => {
    it('Inverse projects [0, 0] -> [0, 0]', () => {
      const proj = new Projection();
      const p = proj.invert([0, 0]);
      expect(p[0]).toBeCloseTo(0, CLOSE);
      expect(p[1]).toBeCloseTo(0, CLOSE);
    });

    it('Inverse projects [256, 256] -> [180, -85.0511287798] (at z1)', () => {
      const proj = new Projection();
      const p = proj.invert([256, 256]);
      expect(p[0]).toBeCloseTo(180, CLOSE);
      expect(p[1]).toBeCloseTo(-85.0511287798, CLOSE);
    });

    it('Inverse projects [-256, -256] -> [-180, 85.0511287798] ->  (at z1)', () => {
      const proj = new Projection();
      const p = proj.invert([-256, -256]);
      expect(p[0]).toBeCloseTo(-180, CLOSE);
      expect(p[1]).toBeCloseTo(85.0511287798, CLOSE);
    });

    it('Inverse projects [512, 512] -> [180, -85.0511287798] (at z2)', () => {
      const proj = new Projection(0, 0, 512 / Math.PI);
      const p = proj.invert([512, 512]);
      expect(p[0]).toBeCloseTo(180, CLOSE);
      expect(p[1]).toBeCloseTo(-85.0511287798, CLOSE);
    });

    it('Inverse projects [-512, -512] -> [-180, 85.0511287798] ->  (at z2)', () => {
      const proj = new Projection(0, 0, 512 / Math.PI);
      const p = proj.invert([-512, -512]);
      expect(p[0]).toBeCloseTo(-180, CLOSE);
      expect(p[1]).toBeCloseTo(85.0511287798, CLOSE);
    });

    it('Applies translation when inverse projecting', () => {
      const proj = new Projection(20, 30);
      const p = proj.invert([-236, -226]);
      expect(p[0]).toBeCloseTo(-180, CLOSE);
      expect(p[1]).toBeCloseTo(85.0511287798, CLOSE);
    });
  });

  describe('#scale', () => {
    it('sets/gets scale', () => {
      const proj = new Projection().scale(512 / Math.PI);
      expect(proj.scale()).toBe(512 / Math.PI);
    });
  });

  describe('#translate', () => {
    it('sets/gets translate', () => {
      const proj = new Projection().translate([20, 30]);
      expect(proj.translate()).toStrictEqual([20, 30]);
    });
  });

  describe('#dimensions', () => {
    it('sets/gets dimensions', () => {
      const proj = new Projection().dimensions([[0, 0], [800, 600]]);
      expect(proj.dimensions()).toStrictEqual([[0, 0], [800, 600]]);
    });
  });

  describe('#transform', () => {
    it('sets/gets transform', () => {
      const t = { x: 20, y: 30, k: 512 / Math.PI };
      const proj = new Projection().transform(t);
      expect(proj.transform()).toMatchObject(t);
    });
  });

  describe('#getStream', () => {
    it('gets a d3 transform stream', () => {
      const proj = new Projection(20, 30);
      let s = proj.getStream();
      let p;

      s.stream = {
        point: (x, y) => {
          p = [x, y];
        }
      };
      s.point(-180, 85.0511287798);
      expect(p[0]).toBeCloseTo(-236, CLOSE);
      expect(p[1]).toBeCloseTo(-226, CLOSE);
    });
  });
});
